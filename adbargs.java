// function adbArgs(pid, ...options) {
//     const args = [];
//     if (pid) {
//         args.push("-s", pid);
//     }

//     // Add the --user param whenever Expo tries to call `adb shell pm list packages`
//     options = options.map(option => {
//         if (option === "packages") {
//             return "packages --user 0";
//         }
//         return option;
//     });

//     return args.concat(options);
// }