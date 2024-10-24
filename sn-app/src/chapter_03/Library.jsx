import React from "react";
import Book from "./Book";

function Library(props) {
  return (
    <div>
      <Book name="폼폼푸린의 하루" numOfPage={300} />
      <Book name="시나모롤의 하루" numOfPage={400} />
      <Book name="포챠코의 하루" numOfPage={500} />
    </div>
  );
}

export default Library;
