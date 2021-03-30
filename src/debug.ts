//https://stackoverflow.com/a/5803801/10713877
/**
 *
 * @param {Error} err
 */
function DEBUG(err: any) {
  if (typeof err === "object") {
    if (err.message) {
      console.log("\nError: " + err.message);
    }
    if (err.stack) {
      console.log("\nStacktrace:");
      console.log("====================");
      console.log(err.stack);
    }
  } else if (typeof err === "string" && err) {
    console.log("\nError: " + err);
  } else {
    console.log("dumpError :: argument is not an object nor string");
  }
}
function DEBUGARR(arr: Array<any>) {
  let str = "";
  for (const elem of arr) {
    str += elem;
  }
  console.log(str);
}
export { DEBUG, DEBUGARR };
