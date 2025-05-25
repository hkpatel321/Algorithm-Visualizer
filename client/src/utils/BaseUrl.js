let prod=false;
let BaseUrl;
if(prod){
      BaseUrl = "https://dijkstra-algorithm-visualizer.onrender.com"; 
}else{
     BaseUrl = "http://localhost:5000"; 
}

export  {BaseUrl};