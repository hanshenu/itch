import { Watcher } from "../watcher";

// TODO: re-implement these elsewhere maybe, they:
//   - implode caves if they failed to install (see queue-install for more thoughts)
//   - start configure after a game installed (should that just be done in launch?)
//   - encourage generosity after a game exited
export default function(watcher: Watcher) {
  // watcher.on(actions.taskEnded, async (store, action) => {
  //   const { taskOpts, result, err } = action.payload;
  //   const { name } = taskOpts;
  //   // FIXME: db
  //   const globalMarket: any = null;
  //   if (err) {
  //     logger.error(`Error in task ${name}: ${err}`);
  //     if (name === "install") {
  //       const { gameId } = taskOpts;
  //       const cave = findWhere(globalMarket.getEntities("caves"), {
  //         gameId,
  //       }) as ICaveRecord;
  //       if (cave && cave.fresh) {
  //         logger.error("Install failed for fresh cave, destroying");
  //         store.dispatch(actions.implodeCave({ caveId: cave.id }));
  //       }
  //     }
  //     return;
  //   }
  //   if (name === "install") {
  //     const { game, gameId, upload } = taskOpts;
  //     const { caveId } = result;
  //     const cave = globalMarket.getEntity("caves", caveId);
  //     const { err: taskErr } = await startTask(store, {
  //       name: "configure",
  //       gameId,
  //       cave,
  //       upload,
  //     });
  //     if (taskErr) {
  //       logger.error(`Error in task ${name}: ${taskErr}`);
  //       return;
  //     }
  //   } else if (name === "launch") {
  //     const { gameId } = taskOpts;
  //     const state = store.getState();
  //     const tab = state.session.tabData[state.session.navigation.id];
  //     logger.info(`game ${gameId} just exited!`);
  //     if (tab && tab.path === `games/${gameId}`) {
  //       logger.info("encouraging generosity!");
  //       store.dispatch(
  //         actions.encourageGenerosity({ gameId: gameId, level: "discreet" }),
  //       );
  //     }
  //   }
  // });
}
