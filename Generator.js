class SudokuSolver{

  size = 9;

  isNumInRow(board, num, row){ // check if number is in the row
      for (let i = 0; i < this.size; i++){
          if (board[row][i] == num){
              return true;
          }
      }
      return false;
  }
  
  isNumInCol(board, num, col){ // check if the number is in the column
      for (let i = 0; i < this.size; i++){
          if (board[i][col] == num){
              return true;
          }
      }
      return false;
  }

  isNumInBox(board, num, row, col){ // check if the number is in the box
      var localBoxRow = row - (row % 3);
      var localBoxCol = col - (col % 3);
      // ex. if you are checking the box at cord 1,4, which would be the top middle box
      // you want to find the top left square of that box which would be 0,3
      // if row is 1 and col is 4, then 1 - (1 % 3) gives you 0 and 4 - (4 % 3) gives you 3
      for (let i = localBoxRow; i < localBoxRow + 3; i++){
          for (let j = localBoxCol; j < localBoxCol + 3; j++){
              if (board[i][j] == num){
                  return true;
              }
          }
      }
      return false;
  }

  valid(board, num, row, col){ // will check if the number is valid to be placed
      return !this.isNumInBox(board, num, row, col) && !this.isNumInCol(board, num ,col) && !this.isNumInRow(board, num, row);
  }

  solve(board){
      for (let row = 0; row < this.size; row++){
          for (let col = 0; col < this.size; col++){
              if (board[row][col] == 0){  // if the square we are at is 0 then we check which number can be placed in that spot
                  for (let numToTry = 1; numToTry <= this.size; numToTry++){
                      if (this.valid(board, numToTry, row, col)){
                          board[row][col] = numToTry;
                          if (this.solve(board)){
                              return true;
                          }
                          else{
                              board[row][col] = 0;
                          // clear the board out if the recursion could not solve the board
                          }
                      }
                  }
                  return false;
              }
          }
      }
      return true;
  }

  print(puzzle, table_num){ // prints the solved board
    for (let i = 0; i < this.size; i++){
        for (let j = 0; j < this.size; j++){
          let td = document.getElementById(table_num + 'r' + i + 'c' + j)
          td.textContent = puzzle[i][j];
          td.style.fontWeight = "bold";
        }
      }
    }
  }


class SudokuGenerator {
    
    constructor(size) {
      this.size = size;  
      this.subSize = Math.sqrt(size);
      this.board = Array.from({ length: size }, () => Array(size).fill(0)); // creates the board intialized with all 0s
    }
  
    generate(emptyCells) { // call this to make the sudoku board
      this.backtrack(0, 0);
      this.removeCells(emptyCells);
      return this.board;
    }
  
    backtrack(row, col) { // recursively make the puzzle
      if (row === this.size) { // base case
        return true;
      }
  
      const nextCol = (col + 1) % this.size; // will go back to 0 when col is 9
      const nextRow = (nextCol === 0) ? row + 1 : row; // if col is 0 then we increment the row otherwise we use the same row
  
      if (this.board[row][col] !== 0) { // checking if the spot already has a number
        return this.backtrack(nextRow, nextCol);
      }
  
      const nums = this.getRandomNums(); // used to populate the puzzle
      for (const num of nums) {
        if (this.isValid(row, col, num)) { // if number can go there we place it there
          this.board[row][col] = num;
          if (this.backtrack(nextRow, nextCol)) { 
            return true;
          }
        }
      }
      this.board[row][col] = 0; 
      return false;
    }
  
    getRandomNums() { // generates array of random numbers using the Fisher-Yates shuffle
      const nums = Array.from({ length: this.size }, (_, i) => i + 1);
      for (let i = this.size - 1; i > 0; i--) {
        const index = Math.floor(Math.random() * (i + 1));
        [nums[i], nums[index]] = [nums[index], nums[i]]; // swaps the values at indices i and index in the nums array.
      }
      return nums;
    }
  
    isValid(row, col, num) {
      for (let i = 0; i < this.size; i++) { // checks the row and col if the number is present
        if (this.board[row][i] === num || this.board[i][col] === num) {
          return false; // if it is return false
        }
      }
      const subRow = Math.floor(row / this.subSize) * this.subSize;  // checks the box to see if the number is present
      const subCol = Math.floor(col / this.subSize) * this.subSize;  // same type of thinking as in the solver
      for (let i = subRow; i < subRow + this.subSize; i++) {
        for (let j = subCol; j < subCol + this.subSize; j++) {
          if (this.board[i][j] === num) {
            return false;
          }
        }
      }
      return true;
    }
  
    removeCells(emptyCells) { // remove however many wanted cells
      while (emptyCells > 0) {
        const row = Math.floor(Math.random() * this.size); // get random rows and cols
        const col = Math.floor(Math.random() * this.size);
        if (this.board[row][col] !== " ") { // if not empty then remove it 
          this.board[row][col] = " ";
          emptyCells--;
        }
      }
    }

    createTable(rows, cols, table_num) { 
      const table = document.getElementById('board' + table_num); 
      if (table.rows.length === 9){ // if there is already a table loaded, remove it
        while (table.rows.length > 0) {
          table.deleteRow(0);
        }
      }
      
      for (let i = 0; i < rows; i++) { // make the new table
        const row = document.createElement('tr'); // create a row
        //row.id = `${table_num}r${i}`; 
  
        for (let j = 0; j < cols; j++) { 
          const cell = document.createElement('td'); // create a data entry 
          cell.id = `${table_num}r${i}c${j}`; 
          cell.onclick = this.makeEditable.bind(null, cell); // make the entry editable
          row.appendChild(cell); // append the data entry to the row
        }
  
        table.appendChild(row); // appened row to the table
      }
    }

    makeEditable(cell) { // allows user to edit the sqaures
      const check_editable = document.getElementById(cell.id);
      if (check_editable.getAttribute('contenteditable') === 'false'){ // make preplaced numbers not editable
        return;
      }
      var loser = document.getElementById("loser"); 
      loser.style.display = "none"; // make try again message disappear

      var input = document.createElement("input"); 
      input.type = "text";
      input.value = cell.innerText; // intitalize the inputs value as the text already in the cell

      cell.innerHTML = ""; //clear the cell
      cell.appendChild(input); //replace the cell value with the input bar

      input.focus();
      input.addEventListener("blur", function() { // updates the value if they move cursor away
        cell.innerText = input.value;
      });
      input.addEventListener("keydown", function(event) { // updates the value on enter
        if (event.key === "Enter") {
          event.preventDefault();
          cell.innerText = input.value; 
        }
      });
    }
    
    main(puzzle, table_num){ // create the uncompleted puzzle
      for (let i = 0; i < puzzle.length; i++) {
        for (let j = 0; j < puzzle.length; j++) {
          let td = document.getElementById(table_num + 'r' + i + 'c' + j) // get the corresponding data entry
          td.textContent= puzzle[i][j]; // put in the corresponding number
          if (puzzle[i][j] != " "){
            td.style.backgroundColor = "#84d0fa"; // change the background color of sqaures that have number in them
            td.contentEditable = false; // 
          }
          td.style.fontWeight = "bold";
          }
        }
      }

    solve_print(puzzle){ // call the solver
      let solved = new SudokuSolver(); 
      solved.solve(puzzle);
      solved.print(puzzle, 2); // 2 is the table num of the solved puzzle
    }
}


function run(level){
    const generator = new SudokuGenerator(9);
    var boards = document.querySelectorAll('table'); 
    boards.forEach(function(board) { // shows the board when a level is clicked
      board.style.visibility = "visible"
    });
    if (level === 'easy'){
      puzzle = generator.generate(45);
    }else if (level === 'medium'){
      puzzle = generator.generate(49);
    }else if (level === 'hard'){
      puzzle = generator.generate(57);
    }else if (level === 'evil'){
      puzzle = generator.generate(63);
    }
    generator.createTable(9,9,1); // create unsolved puzzle
    generator.main(puzzle, 1);
    generator.createTable(9,9,2) // create solved
    generator.solve_print(puzzle, 2);
  
}

