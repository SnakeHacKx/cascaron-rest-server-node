import path from "path";
import * as url from "url";
import { v4 as uuidv4 } from "uuid";

// const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

const uploadFile = (
  files,
  allowedExtensions = ["png", "jpg", "jpeg", "gif"],
  folder = ""
) => {
  return new Promise((resolve, reject) => {
    const { file } = files;
    const splitedName = file.name.split(".");
    const extension = splitedName[splitedName.length - 1];

    // Validar extension

    if (!allowedExtensions.includes(extension)) {
      return reject(
        `La extensión ${extension} no es permitida - extensiones permitidas: ${allowedExtensions}`
      );
    }

    const tempName = uuidv4() + "." + extension;
    const uploadPath = path.join(__dirname, "../uploads/", folder, tempName);

    file.mv(uploadPath, (err) => {
      if (err) {
        reject(err);
      }

      resolve(tempName);
    });
  });
};

export { uploadFile };
