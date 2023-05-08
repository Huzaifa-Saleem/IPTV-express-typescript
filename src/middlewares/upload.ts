import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, "./src/assets");
  },
  filename(req, file, callback) {
    const fileName =
      path
        .basename(file.originalname, path.extname(file.originalname))
        .toLowerCase()
        .replace(/\s+/g, "-") +
      "-" +
      Date.now().toString() +
      path.extname(file.originalname).toLowerCase();
    callback(null, fileName);
  },
});

export const upload = multer({ storage });
