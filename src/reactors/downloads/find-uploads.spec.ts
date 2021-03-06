import suite, { withDB } from "../../test-suite";

import { narrowDownUploads } from "./find-uploads";
import { IRuntime } from "../../types";

import Context from "../../context";

import { IGame } from "../../db/models/game";
import { IUpload, IStore, IAppState } from "../../types";

const asUpload = (x: Partial<IUpload>) => x as IUpload;

// TODO: test more cases

const state = ({
  session: {
    credentials: null,
  },
} as any) as IAppState;

const store = ({
  getState: () => state,
} as any) as IStore;

suite(__filename, s => {
  s.case("narrowDownUploads", async t => {
    await withDB(store, async db => {
      const ctx = new Context(store, db);

      const game = ({
        id: 123,
        classification: "game",
      } as any) as IGame;

      const linux64: IRuntime = {
        platform: "linux",
        is64: true,
      };

      t.same(
        narrowDownUploads(ctx, [], game, linux64),
        {
          hadUntagged: false,
          hadWrongFormat: false,
          hadWrongArch: false,
          uploads: [],
        },
        "empty is empty",
      );

      t.same(
        narrowDownUploads(
          ctx,
          [
            asUpload({
              pLinux: true,
              filename: "wrong.deb",
            }),
            asUpload({
              pLinux: true,
              filename: "nope.rpm",
            }),
          ],
          game,
          linux64,
        ),
        {
          uploads: [],
          hadUntagged: false,
          hadWrongFormat: true,
          hadWrongArch: false,
        },
        "exclude deb/rpm, flag it",
      );

      const love = asUpload({
        pLinux: true,
        pWindows: true,
        pOsx: true,
        filename: "no-really-all-platforms.love",
      });

      t.same(
        narrowDownUploads(
          ctx,
          [
            asUpload({
              filename: "untagged-all-platforms.zip",
            }),
            love,
          ],
          game,
          linux64,
        ),
        {
          uploads: [love],
          hadUntagged: true,
          hadWrongFormat: false,
          hadWrongArch: false,
        },
        "exclude untagged, flag it",
      );

      const sources = asUpload({
        pLinux: true,
        pWindows: true,
        pOsx: true,
        filename: "sources.tar.gz",
      });
      const linuxBinary = asUpload({
        pLinux: true,
        filename: "binary.zip",
      });

      const html = asUpload({
        type: "html",
        filename: "twine-is-not-a-twemulator.zip",
      });

      t.same(
        narrowDownUploads(ctx, [sources, linuxBinary, html], game, linux64),
        {
          uploads: [linuxBinary, sources, html],
          hadUntagged: false,
          hadWrongFormat: false,
          hadWrongArch: false,
        },
        "prefer linux binary",
      );

      const windowsNaked = asUpload({
        pWindows: true,
        filename: "gamemaker-stuff-probably.exe",
      });

      const windowsPortable = asUpload({
        pWindows: true,
        filename: "portable-build.zip",
      });

      const windows32: IRuntime = {
        platform: "windows",
        is64: false,
      };

      t.same(
        narrowDownUploads(
          ctx,
          [html, windowsPortable, windowsNaked],
          game,
          windows32,
        ),
        {
          uploads: [windowsPortable, windowsNaked, html],
          hadUntagged: false,
          hadWrongFormat: false,
          hadWrongArch: false,
        },
        "prefer windows portable, then naked",
      );

      const windowsDemo = asUpload({
        pWindows: true,
        demo: true,
        filename: "windows-demo.zip",
      });

      t.same(
        narrowDownUploads(
          ctx,
          [windowsDemo, windowsPortable, windowsNaked],
          game,
          windows32,
        ),
        {
          uploads: [windowsPortable, windowsNaked, windowsDemo],
          hadUntagged: false,
          hadWrongFormat: false,
          hadWrongArch: false,
        },
        "penalize demos",
      );
    });
  });
});
