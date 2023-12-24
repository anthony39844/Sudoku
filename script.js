function toggleAnswers() {
    var table = document.getElementById("board2");
    if (table.style.display === "inline-block") {
      table.style.display = "none";
    } else {
      table.style.display = "inline-block";
    }
}

function refresh() {
    location.reload(); // Reloads the current page
}

function areTablesIdentical(table1, table2) {
    const rows1 = table1.querySelectorAll('tr'); // get all rows in the tables
    const rows2 = table2.querySelectorAll('tr');
  
    if (rows1.length !== rows2.length) {  // compare table sizes
      return false;
    }
  
    for (let i = 0; i < rows1.length; i++) {   
      const cells1 = rows1[i].querySelectorAll('td'); // get all the data entries
      const cells2 = rows2[i].querySelectorAll('td');
  
      if (cells1.length !== cells2.length) { // check if same number of data entries
        return false;
      }

      for (let j = 0; j < cells1.length; j++) { // compare the data entries
        if (cells1[j].innerText !== cells2[j].innerText) {
          return false;
        }
      }
    }
    return true;
}
  
function checkPuzzles(){
    var check_board = document.getElementById('board1'); 
    var correct_board = document.getElementById('board2');
    var winner = document.getElementById("winner");
    var loser = document.getElementById("loser");
    if (areTablesIdentical(check_board, correct_board)) { 
        correct_board.style.display = "inline-block"; 
        winner.style.display = "flex";
        loser.style.display = "none";
    }else{
        loser.style.display = "flex";
    }
    
}