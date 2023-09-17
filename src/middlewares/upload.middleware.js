import { __dirname } from "../../utils/path.js";
import multer from "multer";

const getDestination = (req, file, cb) => {
  let destinationFolder;

  if (file.fieldname === "profile") {
    destinationFolder = "profile";
  } else if (file.fieldname === "products") {
    destinationFolder = "products";
  } else {
    destinationFolder = "docs";
  }

  cb(null, `${__dirname}/public/upload/${destinationFolder}`);
};

const storage = multer.diskStorage({
  destination: getDestination,
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  },
});

const uploader = multer({ storage: storage });

export default uploader;
