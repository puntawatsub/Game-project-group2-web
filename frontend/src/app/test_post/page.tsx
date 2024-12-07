import React from "react";

const TestPost = () => {
  return (
    <form action="http://localhost:8080/get_ident_player_country" method="POST">
      <input name="iso_country"></input>
      <button type="submit">Submit</button>
    </form>
  );
};

export default TestPost;
