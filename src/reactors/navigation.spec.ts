import suite, { TestWatcher, actions, immediate } from "../test-suite";

import navigation from "./navigation";

suite(__filename, s => {
  s.case("clears filters", async t => {
    const w = new TestWatcher();
    navigation(w);

    w.store.getState().preferences.onlyCompatibleGames = true;
    w.store.getState().preferences.onlyInstalledGames = true;
    w.store.getState().preferences.onlyOwnedGames = true;

    await w.dispatch(actions.clearFilters({}));
    t.false(w.store.getState().preferences.onlyCompatibleGames);
    t.false(w.store.getState().preferences.onlyInstalledGames);
    t.false(w.store.getState().preferences.onlyOwnedGames);
  });

  s.case("handles constant tabs properly", async t => {
    const w = new TestWatcher();
    navigation(w);

    let nav = () => w.store.getState().session.navigation;

    t.same(nav().id, "featured");

    await w.dispatch(actions.navigate("library"));
    t.same(nav().id, "library");

    await w.dispatch(actions.navigate("preferences"));
    t.same(nav().tabs.transient, ["preferences"]);
    t.same(nav().id, "preferences");

    let tabChanged = false;
    w.on(actions.tabChanged, async () => {
      tabChanged = true;
    });
    await w.dispatch(actions.navigate("library"));
    await immediate();
    t.true(tabChanged);
  });

  s.case("handles transient tabs properly", async t => {
    const w = new TestWatcher();
    navigation(w);

    let nav = () => w.store.getState().session.navigation;
    let data = () => w.store.getState().session.tabData;

    let constantTab = nav().id;

    await w.dispatch(actions.navigate("url/https://itch.io"));
    let id1 = nav().id;
    t.same(data()[id1].path, "url/https://itch.io", "set up path properly");

    await w.dispatch(actions.navigate("library"));
    t.same(nav().id, "library");

    await w.dispatch(actions.navigate("url/https://itch.io"));
    t.same(nav().id, id1, "switched to right tab by path");

    await w.dispatch(actions.closeCurrentTab({}));
    t.same(nav().id, constantTab, "closes transient tab");

    await w.dispatch(actions.closeCurrentTab({}));
    t.same(nav().id, constantTab, "doesn't close constant tabs");

    await w.dispatch(actions.navigate("preferences"));
    await w.dispatch(actions.navigate("downloads"));
    t.same(nav().tabs.transient.length, 2, "opens two tabs");

    await w.dispatch(actions.closeAllTabs({}));
    t.same(nav().tabs.transient.length, 0, "closes all tabs");
  });

  s.case("handles transient tabs properly", async t => {
    const w = new TestWatcher();
    navigation(w);

    let nav = () => w.store.getState().session.navigation;
    let data = () => w.store.getState().session.tabData;

    await w.dispatch(actions.navigate("url/https://itch.io"));
    let id = nav().id;
    t.same(data()[id].path, "url/https://itch.io");

    await w.dispatch(
      actions.evolveTab({ id, path: "url/https://itch.io/login" }),
    );
    t.same(data()[id].path, "url/https://itch.io/login", "evolves a tab");
  });
});
