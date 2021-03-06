import { Fetcher } from "./types";
import { QueryInterface } from "../db/querier";

import { addSortAndFilterToQuery } from "./sort-and-filter";

import normalize from "../api/normalize";
import { downloadKey } from "../api/schemas";

import { arrayOf } from "idealizr";

const emptyObj = {} as any;

export default class LibraryFetcher extends Fetcher {
  async work(): Promise<void> {
    await this.pushLocal();

    if (this.warrantsRemote(this.reason)) {
      await this.remote();
      await this.pushLocal();
    }
  }

  async remote() {
    const meId = this.ensureCredentials().me.id;
    const apiResponse = await this.withApi(async api => {
      return await api.myOwnedKeys();
    });

    const normalized = normalize(apiResponse, {
      owned_keys: arrayOf(downloadKey),
    });
    const downloadKeys = normalized.entities.downloadKeys || emptyObj;
    for (const id of Object.keys(downloadKeys)) {
      downloadKeys[id].ownerId = meId;
    }

    const { db } = this.ctx;
    db.saveMany(normalized.entities);

    await this.pushLocal();
  }

  async pushLocal() {
    const { db, store } = this.ctx;
    const { commons } = store.getState();

    const { offset, limit } = this;

    const { libraryGameIds } = commons;

    let doQuery = (k: QueryInterface) =>
      addSortAndFilterToQuery(
        k.whereIn("games.id", libraryGameIds),
        this.tabId,
        store,
      );

    this.pushGames({
      range: db.games.all(k =>
        doQuery(k).offset(offset).limit(limit).select("games.*"),
      ),
      totalCount: libraryGameIds.length,
      getFilteredCount: () => db.games.count(k => doQuery(k)),
    });
  }
}
