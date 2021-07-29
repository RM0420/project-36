var dog, dogIMG, happyDogIMG, foodS, foodStock, feed, addFood, feedTime, lastFed, foodObj

function preload()
{
	dogIMG = loadImage("images/dogIMG.png");
  happyDogIMG = loadImage("images/dogIMG1.png");
}

function setup() {
  database = firebase.database()
	createCanvas(500, 500);
  dog = createSprite(400, 400, 20, 20);
  dog.addImage(dogIMG);
  dog.scale = 0.2

  foodObj = new Food()

  foodStock = database.ref("food");
  foodStock.on("value", readStock);

  feed = createButton("FEED THE DOG")
  feed.position(700, 95);
  feed.mousePressed(feedDog)
  addFood = createButton("ADD FOOD")
  addFood.position(800, 95);
  addFood.mousePressed(addFoods)
  
}


function draw() {
  background(46, 139, 87)

  foodObj.display();

  feedTime = database.ref("feedTime");
  feedTime.on("value", function(data){
    lastFed = data.val();
  })
  fill(255, 255, 254);
  textSize(15);
  if(lastFed>=12){
    text("Last Feed: " + lastFed%12 + " PM", 350, 30);
  } else if(lastFed === 0){
    text("Last Feed: 12 AM", 350, 30);
  } else {
    text("Last Feed: " + lastFed + " AM", 350, 30);
  }

  drawSprites();
  //add styles here

  textSize(20);
  fill("red");
  stroke("orange");
  text("food left: " + foodS, 10, 150);

}

function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

//function writeStock(x){

  //if(x<=0){
   // x = 0
  //}else{
    //x = x-1
  //}

  //database.ref("/").update({
    //food:x
  //})
//}

function feedDog(){
  dog.addImage(happyDogIMG);

  var foodStocks = foodObj.getFoodStock();
  if(foodStocks<=0){
    foodObj.updateFoodStock(foodStocks*0);
  }
  else {
    foodObj.updateFoodStock(foodStocks-1);
  }
  database.ref("/").update({
    food:foodObj.getFoodStock(),
    feedTime:hour(),
  })
}

function addFoods(){
  foodS++;
  database.ref("/").update({
    food:foodS
  })
}