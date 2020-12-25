import React, { Component } from "react";
import car1 from "../Assets/car_yellow.png";
import car2 from "../Assets/car_red.png";
import circle1 from "../Assets/circle_blue.png";
import circle2 from "../Assets/circle_red.png";
import square1 from "../Assets/square_blue.png";
import square2 from "../Assets/square_red.png";
import helpText from "../Assets/HelpText1.svg"
import play from "../Assets/boton_play.png"
import replay from "../Assets/boton_reload.png"
class Game extends Component {
  constructor(props) {
    super(props);
    this.timer = null;
    this.state = {
      screen: {
        width: Math.min(window.innerWidth, 360),
        height: window.innerHeight,
        ratio: window.devicePixelRatio || 1,
      },
      context: null,
      carWidth: 35,
      carHeight: 70,
      car1: null,
      car2: null,
      circle1: null,
      circle2: null,
      square1: null,
      square2: null,
      helpText: null,
      play:null,
      replay:null,
      segment1: [],
      segment2: [],
      items: null,
      speed: 4,
      car1Pos: 0,
      car2Pos: 2,
      move1To: 0,
      move2To: 2,
      score: 0,
      best:0,
      gameStatus: -1,
      fps: 60,
    };
  }
  componentDidMount() {
    const canvas=this.refs.canvas;
    const context = canvas.getContext("2d");
    console.log(this.state.screen.ratio);
    canvas.style.width=this.state.screen.width+"px";
    canvas.style.height=this.state.screen.height+"px";
    context.scale(this.state.screen.ratio,this.state.screen.ratio);
    window.addEventListener("keydown", this.handleKeys.bind(this));
    canvas.addEventListener("mousedown",this.handleMouse.bind(this))
    this.setState({
      context: context,
      car1: this.refs.car1,
      car2: this.refs.car2,
      circle1: this.refs.circle1,
      circle2: this.refs.circle2,
      square1: this.refs.square1,
      square2: this.refs.square2,
      helpText:this.refs.help,
      play: this.refs.play,
      replay:this.refs.replay
    });
    this.setState(prevState=>({  items: [prevState.circle1, prevState.square1,prevState.circle2,prevState.square2],}),
    ()=>{
        console.log(this.state.helpText);
        this.renderStartGame(context);
    });

  }
  update() {
    console.log(this.state.move1To);
    const ctx = this.state.context;
    this.handleMove(ctx);
  
    if (this.state.segment1[this.state.segment1.length - 1][2]>=this.state.screen.height/3){
      this.createSegment();
    }

    if (this.state.segment1[0][2]>=this.posY(0) && this.state.segment1[0][2]<=this.posY(0)+20){

      if(this.isGameOver()){
        clearInterval(this.timer);
        ctx.globalAlpha=0.2;
        this.renderGameOver(ctx);

        return;
      }
      else{
      }

    }
    if (this.state.segment1[0][2]>this.state.screen.height){
      this.setState(prevState=>({score:prevState.score+1}));
      this.deleteSegement();
    }
    if (this.state.segment1[0][2]>1000){}
    const segment1=[...this.state.segment1];
    const newsegment1 = segment1.map(a => [a[0],a[1],a[2]+this.state.speed]);
    const segment2=[...this.state.segment2];
    const newsegment2 = segment2.map(a => [a[0],a[1],a[2]+this.state.speed]);
   this.setState({segment1:newsegment1,segment2:newsegment2},()=>{
    this.renderObjects(ctx);
   });


    this.timer = requestAnimationFrame(this.update.bind(this));

  }
  startGame(){
    this.setState({
      segment1:[],
      segment2:[],
      car1Pos: 0,
      car2Pos: 2,
      move1To: 0,
      move2To: 2,
      score: 0,
    });
    this.createSegment();
    this.timer = requestAnimationFrame(this.update.bind(this));

  }
  renderStartGame(ctx){
    const height=this.state.screen.height/5;
    ctx.globalAlpha=0.7;
    ctx.fillStyle="black";
    ctx.fillRect(0,0,this.state.screen.width,this.state.screen.height);
    ctx.globalAlpha=1;
    ctx.fillStyle="white";
    ctx.textAlign="center";
    ctx.font = "40px 'Roboto Slab'";
    ctx.fillText("2CARS",this.state.screen.width/2,height);
    const val1=this.state.play;
    val1.onload=()=>{
    ctx.drawImage(val1,this.state.screen.width/2-20,height+20,45,45);
    }
    const val=this.state.helpText;
    
    val.onload=()=>{
    ctx.drawImage(val,0,height+300,this.state.screen.width,65);
    }
  }
  renderObjects(ctx){
    ctx.clearRect(0, 0, this.state.screen.width, this.state.screen.height);
    this.renderPlayground(ctx);
    ctx.textAlign="right";
    ctx.fillStyle="white";
    ctx.font="40px Arial";
    ctx.fillText(this.state.score,this.posX(3)+20,40);
    this.state.segment1.map(a=>{
      if(a[0]){
      ctx.drawImage(a[0],this.posX(a[1])-9,a[2],30,30);}
      return a;
    }
      );

    this.state.segment2.map(a=>{
      if(a[0]){
        ctx.drawImage(a[0],this.posX(a[1])-9,a[2],30,30);}
        return a;
      }
        );
    ctx.drawImage(
      this.state.car1,
      this.posX(this.state.car1Pos)-10,
      this.posY(0),
      this.state.carWidth,
      this.state.carHeight
    );
    ctx.drawImage(
      this.state.car2,
      this.posX(this.state.car2Pos)-10,
      this.posY(0),
      this.state.carWidth,
      this.state.carHeight
    );
  }
  isGameOver(){
    let isOver=false;
    if(this.state.segment1[0][0]===this.state.items[0]){
      this.state.segment1[0][0]=null;
      if(this.state.segment1[0][1]!==this.state.car1Pos){
        isOver=true;
      }
    }
    if(this.state.segment1[0][0]===this.state.items[1]){
      if(this.state.segment1[0][1]===this.state.car1Pos){
        isOver=true;
      }
    }
    if(this.state.segment2[0][0]===this.state.items[2]){
      this.state.segment2[0][0]=null;
      if(this.state.segment2[0][1]!==this.state.car2Pos){
        isOver=true;
      }
    }
    if(this.state.segment1[0][0]===this.state.items[3]){
      if(this.state.segment2[0][1]===this.state.car2Pos){
        isOver=true;
      }
    }
    return isOver;
  }
  renderGameOver(ctx){
    this.setState({gameStatus:-2});
    const height=this.state.screen.height/5;
    if (this.state.score>this.state.best){
      this.setState(prevState=>({best:prevState.score}));
    }
    ctx.globalAlpha=0.7;
    ctx.fillStyle="black";
    ctx.fillRect(0,0,this.state.screen.width,this.state.screen.height);
    ctx.globalAlpha=2;
    ctx.fillStyle="white";
    ctx.textAlign="center";
    ctx.font = "40px 'Roboto Slab'";
    ctx.fillText("GAME OVER",this.state.screen.width/2,height);
    ctx.font = "25px 'Roboto Slab'";
    const score="SCORE   "+this.state.score;
    ctx.fillText(score,this.state.screen.width/2,height+60);
    const best="BEST      "+this.state.best;
    ctx.fillText(best,this.state.screen.width/2,height+100);
    const val1=this.state.replay;
    console.log(this.state.replay);
    console.log(val1)
    ctx.drawImage(val1,this.state.screen.width/2-20,height+120,45,45);
    ctx.drawImage(this.state.helpText,0,height+300,this.state.screen.width,65)
  }
  handleMove(ctx) {
    if (this.state.move1To === 0) {
      this.setState({
        car1Pos: Math.max(
          0,
          this.state.car1Pos - 3*this.state.speed/this.state.fps
        ),
      });
    }
    if (this.state.move1To === 1) {
      this.setState({
        car1Pos: Math.min(
          1,
          this.state.car1Pos + 3*this.state.speed / this.state.fps
        ),
      });
    }
    if (this.state.move2To === 2) {
      this.setState({
        car2Pos: Math.max(
          2,
          this.state.car2Pos - 3*this.state.speed / this.state.fps
        ),
      });
    }
    if (this.state.move2To === 3) {
      this.setState({
        car2Pos: Math.min(
          3,
          this.state.car2Pos + 3*this.state.speed / this.state.fps
        ),
      });
    }
  }
  handleMouse(e){
    const height=this.state.screen.height/5;
    if(this.state.gameStatus!==1){
      if(this.state.gameStatus===-1 && e.offsetX>=this.state.screen.width/2-20 && e.offsetY>=height+20 && e.offsetX<=this.state.screen.width/2-20+45 && e.offsetY<=height+20+45){
        this.startGame();
        this.setState({gameStatus:1});
      }
      if(this.state.gameStatus===-2 && e.offsetX>=this.state.screen.width/2-20 && e.offsetY>=height+120 && e.offsetX<=this.state.screen.width/2-20+45 && e.offsetY<=height+120+45){
        this.startGame();
        this.setState({gameStatus:1});
      }

    }
    else{
      if(e.offsetX<this.state.screen.width/2){
        this.setState(prevState=>({ move1To: 1-prevState.move1To }));
      }
      else{
      this.setState(prevState=>({ move2To: 2+1-(prevState.move2To-2) }));

      }
    }
  }
  createSegment() {
    const item1 = Math.floor(2 * Math.random());
    const item2 = Math.floor(2 * Math.random() + 2);
    const path1 = Math.floor(2 * Math.random());
    const path2 = Math.floor(2 * Math.random() + 2);
    this.setState({ segment1: [...this.state.segment1,[this.state.items[item1],path1,-20]]});
    this.setState({ segment2: [...this.state.segment2,[this.state.items[item2],path2,-20]]});  
  }
  deleteSegement() {
    this.setState({segment1: this.state.segment1.filter((_, i) => i !== 0)});
    this.setState({segment2: this.state.segment2.filter((_, i) => i !== 0)});
  }
  posY(i) {
    return this.state.screen.height - i - 180;
  }
  posX(i) {
    const x = this.state.screen.width / 8;
    return x + 2 * x * i;
  }
  handleKeys(e) {
    const value = e.key;
    console.log(e.key);
    e.preventDefault();
    if (value === "a" || value === "A" || value==="ArrowLeft") {
      this.setState(prevState=>({ move1To: 1-prevState.move1To }));
      
    }
    if (value === "l" || value === "L" || value==="ArrowRight") {
      this.setState(prevState=>({ move2To: 2+1-(prevState.move2To-2) }));
    }

  }
  renderPlayground(ctx) {
    ctx.fillStyle = "white";

    ctx.fillRect(
      this.state.screen.width / 2 - 2,
      0,
      4,
      this.state.screen.height
    );
    ctx.fillStyle = "#0096c7";

    ctx.fillRect(
      this.state.screen.width / 4 - 1,
      0,
      2,
      this.state.screen.height
    );
    ctx.fillRect(
      (3 * this.state.screen.width) / 4 - 1,
      0,
      2,
      this.state.screen.height
    );
  }

  render() {
    return (
      <div>
        <img src={car1} ref="car1" hidden={true} alt=""></img>
        <img src={car2} ref="car2" hidden={true} alt=""></img>
        <img src={circle1} ref="circle1" hidden={true} alt=""></img>
        <img src={circle2} ref="circle2" hidden={true} alt=""></img>
        <img src={square1} ref="square1" hidden={true} alt=""></img>
        <img src={square2} ref="square2" hidden={true} alt=""></img>
        <img src={helpText} ref="help" hidden={true} alt=""></img>
        <img src={play} ref="play" hidden={true} alt=""></img>
        <img src={replay} ref="replay" hidden={true} alt=""></img>
        <canvas
          ref="canvas"
          width={this.state.screen.width*this.state.screen.ratio}
          height={this.state.screen.height*this.state.screen.ratio}
          style={{ background: "#052b2b" }}
        />
      </div>
    );
  }
}
export default Game;