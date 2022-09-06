import Resizer from "react-image-file-resizer";

/** Wait for x ms in an async function */
export const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

/** Convert an address into a short address with only the first 7 + last 7 characters */
export function shortAddress(_address) {
  if(!_address) {
    return "-";
  }

  const _firstChars = _address.substring(0, 5);
  const _lastChars = _address.substr(_address.length - 5);
  return _firstChars.concat('-', _lastChars);
}

/** Returns current timestamp */
export function getTimestamp() {
  const cur_timestamp = Math.round(new Date().getTime() / 1000).toString()
  return cur_timestamp;
}

/** Returns true if object is an array */
export function isArray(obj) {
  return Object.prototype.toString.call(obj) === '[object Array]';
}

/** Convert local base64 image to a file object that can be pushed to Arweave */
export async function base64ToFile(dataURL, fileName) {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    return (fetch(dataURL).then(function (result) {
      return result.arrayBuffer();
    }));
}

/** Generate random id */
export function randomId() {
  return Math.floor(Math.random() * 10) + 1 * Date.now();
}

/** Resize image uploaded */
export const resizeFile = (file, maxSize = 300, type = "PNG") =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
        file,
        maxSize,
        maxSize,
        "WEBP",
        100,
        0,
        (uri) => {
            resolve(uri);
        },
        "base64"
    );
});

/** Returns a dictionary of clean name for contract addresses that might be use to token gate content */
export const contractToCleanName = {
  "0x0a098221bb295704ac70f60def959828f935ac4e": "Kumo x World",
  "0xed5af388653567af2f388e6224dc7c4b3241c544": "Azuki",
  "0x123b30e25973fecd8354dd5f41cc45a3065ef88c": "Alien Frens",
  "0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85": "ENS Domains",
  "0xc944e90c64b2c07662a292be6244bdf05cda44a7": "GRT",
  "0x5c8bfBE3475224A24C891A590D7F8aFed13979F1": "Coordinate Token"
};


/** Returns a valid url for the channel icon */
export function getChannelIcon(channel, active) {
  let _iconUrl;

  /** Error  */
  if(channel?.content) {
    /** Icons logic */
    if(channel.content.type == "chat") {
      if(active) {
        if(channel.content.encryptionRules) {
          /** Channel is a chat, active and encrypted */
          _iconUrl = "/img/icons/chat-locked-white.png";
        } else {
          /** Channel is a chat, active and not encrypted */
          _iconUrl = "/img/icons/chat-white.png";
        }
      } else {
        if(channel.content.encryptionRules) {
          /** Channel is a chat, not active and encrypted */
          _iconUrl = "/img/icons/chat-locked-grey.png";
        } else {
          /** Channel is a chat, not active and not encrypted */
          _iconUrl = "/img/icons/chat-grey.png";
        }
      }
    } else {
      if(active) {
        if(channel.content.encryptionRules) {
          /** Channel is a chat, active and encrypted */
          _iconUrl = "/img/icons/hashtag-locked-white.png";
        } else {
          /** Channel is a chat, active and not encrypted */
          _iconUrl = "/img/icons/hashtag-white.png";
        }
      } else {
        if(channel.content.encryptionRules) {
          /** Channel is a chat, not active and encrypted */
          _iconUrl = "/img/icons/hashtag-locked-grey.png";
        } else {
          /** Channel is a chat, not active and not encrypted */
          _iconUrl = "/img/icons/hashtag-grey.png";
        }
      }
    }
  }

  return _iconUrl;
}
