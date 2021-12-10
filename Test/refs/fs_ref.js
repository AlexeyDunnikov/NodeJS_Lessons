const fs = require("fs");
const path = require("path");

//File system

//Create directory
// fs.mkdir(path.join(__dirname, 'notes'), err => {
//     if (err) throw new Error(err);
//     console.log('Папка была создана');
// })

//Create files
// for (let i = 1; i <= 10; i++) {
//   const fileName = `note-${i}.txt`;
//   const pathToFile = path.join(__dirname, "notes", fileName);

//   fs.writeFile(pathToFile, `Message in ${i} file`, (err) => {
//     if (err) throw err;
//     console.log(`Файл ${fileName} был создан`);

//     //append file
//     fs.appendFile(pathToFile, `\nДополнение файла ${i}`, (err) => {
//       if (err) throw err;
//       console.log(`Файл ${fileName} был дополнен`);

//       //Read file
//       fs.readFile(pathToFile, "utf-8", (err, data) => {
//         if (err) throw err;
//         console.log(data);
//       });
//     });
//   });
// }

//Rename files
for (let i = 1; i <= 10; i++) {
  const fileName = `note-${i}.txt`;
  const pathToFile = path.join(__dirname, "notes", fileName);

  fs.rename(
      pathToFile,
      path.join(__dirname, "notes", `note-new${i}`),
      err => {
          if (err) throw err;

          console.log('Файл переименован');
      }
  )
}


