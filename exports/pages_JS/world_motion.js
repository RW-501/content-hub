
function injectAssetsForPage(targetPath) {
    console.log("loaded JS");

  // Check if current path matches
  if (window.location.pathname.includes(targetPath)) {
    const head = document.head;

    // Helper to avoid duplicates
    function addTag(tagName, attrs, innerContent = "") {
      if ([...head.children].some(el => 
          el.tagName.toLowerCase() === tagName.toLowerCase() &&
          Object.entries(attrs).every(([k,v]) => el.getAttribute(k) === v))) {
        return; // already added
      }
      const el = document.createElement(tagName);
      for (let [key, value] of Object.entries(attrs)) {
        el.setAttribute(key, value);
      }
      if (innerContent) el.innerHTML = innerContent;
      head.appendChild(el);
    }

    // Add Bootstrap CSS
    addTag("link", {
      rel: "stylesheet",
      href: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
    });

    // Add Bootstrap Icons
    addTag("link", {
      rel: "stylesheet",
      href: "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css"
    });

    // Add Chart.js
    addTag("script", {
      src: "https://cdn.jsdelivr.net/npm/chart.js"
    });

    // Add custom styles
    addTag("style", {}, `
      body { padding: 20px; background: linear-gradient(to right, #e0f7fa, #f1f8e9); font-family: 'Segoe UI', sans-serif;}
      h1 { text-align: center; font-weight: bold; margin-bottom: 30px; }
      .activity-card { 
        padding: 15px; border-radius: 12px; margin-bottom: 15px; 
        box-shadow: 0 5px 15px rgba(0,0,0,0.1); cursor:pointer;
        opacity: 0; transform: translateY(20px); transition: all 0.5s ease, transform 0.5s ease;
      }
      .activity-card.show { opacity: 1; transform: translateY(0); }
      .category-badge { font-size: 0.8rem; margin-left: 5px; }
      .count { font-weight: bold; color: #007bff; }
      #timelineLabel { font-weight: bold; font-size: 1.1rem; }
      .slider-container { margin-bottom: 30px; }
      .top-activities { margin-top: 20px; }
      .top-activities .list-group-item:hover { transform: scale(1.05); background-color: #d9edf7; transition: all 0.3s; cursor:pointer; }
      .converter { margin-top: 20px; padding: 15px; background: #fff; border-radius: 12px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);}
      .converter input, .converter select { margin-right: 10px; width: auto; display:inline-block; }
      .event { padding: 5px 10px; border-radius: 8px; margin-bottom: 5px; display:inline-block; background: #ffecb3; color: #ff6f00; font-weight:bold; }
      .card-pop { box-shadow: 0 15px 25px rgba(0,0,0,0.3); transform: scale(1.05); transition: 0.3s; }
    `);
  }
}

// Example: only inject on "/analytics" page
injectAssetsForPage("/page/world-in-motion-counting-life-one-second-at-a-time");

let activities = [
  // Base real activities (35)
  { id:"births", name:"Births", ratePerSecond:4.3, category:"Population", description:"Babies born worldwide per second.", unit:"people" },
  { id:"deaths", name:"Deaths", ratePerSecond:1.8, category:"Population", description:"Deaths worldwide per second.", unit:"people" },
  { id:"marriages", name:"Marriages", ratePerSecond:0.2, category:"Population", description:"Marriages worldwide per second.", unit:"couples" },
  { id:"divorces", name:"Divorces", ratePerSecond:0.05, category:"Population", description:"Divorces worldwide per second.", unit:"couples" },
  { id:"babiesNamedEmma", name:"Babies Named Emma", ratePerSecond:0.003, category:"Population", description:"Babies named Emma per second.", unit:"people" },
  { id:"googlesearches", name:"Google Searches", ratePerSecond:99000, category:"Technology", description:"Google searches per second.", unit:"searches" },
  { id:"emails", name:"Emails Sent", ratePerSecond:50000, category:"Technology", description:"Emails sent per second.", unit:"emails" },
  { id:"whatsapp", name:"WhatsApp Messages", ratePerSecond:700000, category:"Technology", description:"WhatsApp messages sent per second.", unit:"messages" },
  { id:"youtube", name:"YouTube Videos Watched", ratePerSecond:70000, category:"Technology", description:"Hours of YouTube videos watched per second.", unit:"hours" },
  { id:"instagramPosts", name:"Instagram Posts", ratePerSecond:500, category:"Technology", description:"Instagram posts uploaded per second.", unit:"posts" },
  { id:"co2", name:"CO₂ Emissions", ratePerSecond:1000, category:"Environment", description:"Tons of CO₂ emitted per second.", unit:"tons" },
  { id:"trees", name:"Trees Cut Down", ratePerSecond:2.5, category:"Environment", description:"Trees cut down per second.", unit:"trees" },
  { id:"plastic", name:"Plastic Waste Dumped", ratePerSecond:500, category:"Environment", description:"Kg of plastic dumped per second.", unit:"kg" },
  { id:"lightning", name:"Lightning Strikes", ratePerSecond:100, category:"Environment", description:"Lightning strikes worldwide per second.", unit:"strikes" },
  { id:"oceanWaves", name:"Ocean Waves Crash", ratePerSecond:10000, category:"Environment", description:"Individual ocean waves hitting the shore per second.", unit:"waves" },
  { id:"coffee", name:"Cups of Coffee", ratePerSecond:855, category:"Economy", description:"Cups of coffee consumed per second worldwide.", unit:"cups" },
  { id:"pizzas", name:"Pizzas Sold", ratePerSecond:350, category:"Economy", description:"Pizzas sold worldwide per second.", unit:"pizzas" },
  { id:"onlineSales", name:"Online Dollars Spent", ratePerSecond:6000000, category:"Economy", description:"Dollars spent online per second.", unit:"$" },
  { id:"carsProduced", name:"Cars Produced", ratePerSecond:2, category:"Economy", description:"Cars produced worldwide per second.", unit:"cars" },
  { id:"bankTransactions", name:"Bank Transactions", ratePerSecond:5000, category:"Economy", description:"Financial transactions per second worldwide.", unit:"transactions" },
  { id:"burgers", name:"Burgers Eaten", ratePerSecond:500, category:"Food & Drink", description:"Burgers eaten worldwide per second.", unit:"burgers" },
  { id:"cupsTea", name:"Cups of Tea", ratePerSecond:20000, category:"Food & Drink", description:"Cups of tea consumed worldwide per second.", unit:"cups" },
  { id:"iceCream", name:"Ice Cream Cones", ratePerSecond:150, category:"Food & Drink", description:"Ice cream cones eaten worldwide per second.", unit:"cones" },
  { id:"sodas", name:"Sodas Drunk", ratePerSecond:1000, category:"Food & Drink", description:"Sodas consumed per second worldwide.", unit:"cans" },
  { id:"waterBottles", name:"Bottled Water Drunk", ratePerSecond:3000, category:"Food & Drink", description:"Bottled water consumed per second worldwide.", unit:"bottles" },
  { id:"moviesWatched", name:"Movies Watched", ratePerSecond:10, category:"Entertainment", description:"Movies watched worldwide per second.", unit:"movies" },
  { id:"songsPlayed", name:"Songs Played", ratePerSecond:50, category:"Entertainment", description:"Songs streamed worldwide per second.", unit:"songs" },
  { id:"videoGamesPlayed", name:"Video Games Played", ratePerSecond:20, category:"Entertainment", description:"Video games started worldwide per second.", unit:"sessions" },
  { id:"booksRead", name:"Books Read", ratePerSecond:1.5, category:"Entertainment", description:"Books completed worldwide per second.", unit:"books" },
  { id:"concertTickets", name:"Concert Tickets Bought", ratePerSecond:2, category:"Entertainment", description:"Concert tickets purchased per second worldwide.", unit:"tickets" },
  { id:"flights", name:"Flights Taken", ratePerSecond:1.2, category:"Transport", description:"Flights taken worldwide per second.", unit:"flights" },
  { id:"trains", name:"Train Passengers", ratePerSecond:250, category:"Transport", description:"Passengers on trains worldwide per second.", unit:"passengers" },
  { id:"carsDriven", name:"Cars Driven", ratePerSecond:1500, category:"Transport", description:"Cars on the road worldwide per second.", unit:"cars" },
  { id:"bicycles", name:"Bicycles Ridden", ratePerSecond:400, category:"Transport", description:"Bicycles ridden worldwide per second.", unit:"bikes" },
  { id:"ships", name:"Ships Sailing", ratePerSecond:0.8, category:"Transport", description:"Ships sailing worldwide per second.", unit:"ships" },
  { id:"vaccinations", name:"Vaccinations", ratePerSecond:120, category:"Health", description:"Vaccinations administered worldwide per second.", unit:"shots" },
  { id:"hospitalVisits", name:"Hospital Visits", ratePerSecond:100, category:"Health", description:"Hospital visits worldwide per second.", unit:"visits" },
  { id:"stepsTaken", name:"Steps Taken", ratePerSecond:500000, category:"Health", description:"Steps taken worldwide per second.", unit:"steps" },
  { id:"caloriesBurned", name:"Calories Burned", ratePerSecond:2000000, category:"Health", description:"Calories burned worldwide per second.", unit:"calories" },
  { id:"waterConsumed", name:"Liters of Water Drunk", ratePerSecond:5000, category:"Health", description:"Liters of water consumed worldwide per second.", unit:"liters" }
];

// -------------------- Generate 200+ activities --------------------
const categories = {
  "Population": ["Babies Named Liam", "Babies Named Noah", "Babies Named Olivia", "Life Expectancy Increase", "Population Migration"],
  "Technology": ["TikTok Videos Uploaded", "Tweets Sent", "Snapchat Messages", "Emails Opened", "GitHub Commits"],
  "Environment": ["Plastic Bottles Recycled", "Solar Panels Installed", "Wind Turbines Built", "Rainfall Events", "Earthquakes Detected"],
  "Economy": ["Bitcoin Transactions", "ATM Withdrawals", "Stocks Traded", "Coffee Beans Sold", "Fast Food Orders"],
  "Food & Drink": ["Pizzas Delivered", "Ice Cream Sandwiches Eaten", "Sushi Rolls Consumed", "Chocolate Bars Eaten", "Beer Bottles Drunk"],
  "Entertainment": ["Netflix Streams", "Spotify Streams", "Video Games Played", "Movies Downloaded", "YouTube Likes"],
  "Transport": ["Uber Rides", "Electric Scooters Ridden", "Buses Taken", "High-Speed Trains", "Flights Delayed"],
  "Health": ["Vaccinations Given", "Hospital Appointments", "Steps Walked", "Calories Burned", "Yoga Sessions"]
};

function generateActivities(base, categories, target = 200) {
  let idCounter = base.length + 1;
  let newActivities = [...base];

  // Map categories to default units
  const defaultUnits = {
    "Population": "people",
    "Technology": "actions",
    "Environment": "events",
    "Economy": "$",
    "Food & Drink": "items",
    "Entertainment": "sessions",
    "Transport": "rides",
    "Health": "units"
  };

  while (newActivities.length < target) {
    let done = false; // flag to break out early
    for (const [cat, names] of Object.entries(categories)) {
      for (const name of names) {
        if (newActivities.length >= target) {
          done = true;
          break; // break inner loop
        }

        let id = name.replace(/\s+/g, '').toLowerCase() + idCounter;
        let rate = +(Math.random() * 1000).toFixed(2);
        let unit = defaultUnits[cat] || "units"; // fall back to "units" if not mapped

        newActivities.push({
          id,
          name,
          ratePerSecond: rate,
          category: cat,
          description: `${name} per second worldwide.`,
          unit
        });

        idCounter++;
      }
      if (done) break; // break outer loop too
    }
  }

  return newActivities;
}


activities = generateActivities(activities, categories, 200);

console.log(activities); // Ready-to-use array of 200+ activities


let startTime = Date.now();
let sortDescending = false;
const timeline = document.getElementById("timeline");
const timelineLabel = document.getElementById("timelineLabel");

// Format numbers with shorthand
function formatNumber(num) {
  if(num>1e9) return (num/1e9).toFixed(2)+"B";
  if(num>1e6) return (num/1e6).toFixed(2)+"M";
  if(num>1e3) return (num/1e3).toFixed(1)+"K";
  return num.toFixed(0);
}

// Animate counters
function animateCount(el, target){
  let current = parseFloat(el.dataset.value||0);
  let diff = target-current;
  if(Math.abs(diff)<1){ el.textContent=formatNumber(target); el.dataset.value=target; return; }
  el.dataset.value=current+diff*0.1;
  el.textContent=formatNumber(current+diff*0.1);
  requestAnimationFrame(()=>animateCount(el,target));
}

// Render activity cards
function renderActivities(){
  let searchTerm = document.getElementById("searchInput").value.toLowerCase();
  let filterCat = document.getElementById("filterCategory").value;
  let year = parseInt(timeline.value);
  let currentYear = new Date().getFullYear();
  let elapsedSeconds = year===currentYear ? (Date.now()-startTime)/1000 : (year-currentYear)*365.25*24*3600;

  let container = document.getElementById("activities");
  container.innerHTML = "";
  let filtered = activities.filter(a=>{
    return (!filterCat||a.category===filterCat) &&
           (!searchTerm||a.name.toLowerCase().includes(searchTerm)||a.description.toLowerCase().includes(searchTerm));
  });
  if(sortDescending) filtered.sort((a,b)=>b.ratePerSecond-a.ratePerSecond);

  filtered.forEach(a=>{
    let count=a.ratePerSecond*elapsedSeconds;
    let card=document.createElement("div");
    card.className="col";
    card.innerHTML=`
      <div class="activity-card" data-activity="${a.id}">
        <h5>${a.name} <span class="badge bg-secondary category-badge">${a.category}</span></h5>
        <p>${a.description}</p>
        <p><i class="bi bi-calculator"></i> Count: <span class="count" data-value="0">${formatNumber(count)}</span> ${a.unit}</p>
      </div>`;
    container.appendChild(card);
    animateCount(card.querySelector(".count"),count);
    setTimeout(()=>card.querySelector('.activity-card').classList.add('show'),50);
  });

  timelineLabel.textContent = year;

  // Top 5 leaderboard
  let leaderboard=document.getElementById("leaderboard");
  leaderboard.innerHTML="";
  activities.slice().sort((a,b)=>b.ratePerSecond-a.ratePerSecond).slice(0,5).forEach(a=>{
    let li=document.createElement("li");
    li.className="list-group-item d-flex justify-content-between align-items-center";
    li.textContent=a.name;
    li.innerHTML+=`<span class="badge bg-primary rounded-pill">${formatNumber(a.ratePerSecond)}/s</span>`;
    leaderboard.appendChild(li);
  });

  if(activityChart) updateChart();
}

// Unit converter
document.getElementById("convertBtn").addEventListener("click", ()=>{
  let value=parseFloat(document.getElementById("convertValue").value);
  let to=document.getElementById("convertTo").value;
  if(isNaN(value)) return;
  let converted=value;
  if(to==="thousands") converted=value/1e3;
  if(to==="millions") converted=value/1e6;
  if(to==="billions") converted=value/1e9;
  document.getElementById("convertResult").textContent=formatNumber(converted);
});

// ----------------- Chart with Animated Dots & Trailing Lines -----------------
let activityChart;
let dotProgress=[];
let animationId;

function createChart(){
  const ctx=document.getElementById('activityChart').getContext('2d');
  const labels=[];
  for(let y=1900;y<=2100;y+=10) labels.push(y);

  const datasets=activities.map(a=>({
    label:a.name,
    data:labels.map(_=>0),
    borderColor:`hsl(${Math.random()*360},70%,50%)`,
    fill:false,
    tension:0.3,
    borderWidth:2,
    pointRadius:0
  }));

  activityChart=new Chart(ctx,{
    type:'line',
    data:{labels,datasets},
    options:{
      responsive:true,
      plugins:{legend:{position:'bottom'},tooltip:{mode:'index',intersect:false}},
      interaction:{mode:'nearest',axis:'x',intersect:false},
      scales:{y:{beginAtZero:true,title:{display:true,text:'Count'}},x:{title:{display:true,text:'Year'}}}
    },
    plugins:[{
      id:'flowingDots',
      afterDraw:chart=>{
        const ctx=chart.ctx;
        chart.data.datasets.forEach((ds,i)=>{
          const meta=chart.getDatasetMeta(i);
          const points=meta.data;
          if(points.length<2) return;
          let t=dotProgress[i]||0;
          let idx=Math.floor(t); let frac=t-idx;
          if(idx>=points.length-1) idx=points.length-2;
          const x=points[idx].x+(points[idx+1].x-points[idx].x)*frac;
          const y=points[idx].y+(points[idx+1].y-points[idx].y)*frac;

          // Draw trailing line
          ctx.save();
          ctx.strokeStyle=ds.borderColor+'88';
          ctx.lineWidth=2;
          ctx.beginPath();
          ctx.moveTo(points[0].x, points[0].y);
          for(let j=1;j<=idx;j++) ctx.lineTo(points[j].x, points[j].y);
          ctx.lineTo(x,y);
          ctx.stroke();
          ctx.restore();

          // Draw moving dot
          ctx.save();
          ctx.fillStyle=ds.borderColor;
          ctx.beginPath();
          ctx.arc(x,y,6,0,2*Math.PI);
          ctx.fill();
          ctx.restore();
        });
      }
    }]
  });

  dotProgress=new Array(activities.length).fill(0);
  animateChartGrowth();
}

function animateChartGrowth(){
  const year=parseInt(timeline.value);
  const duration=1500;
  const startTime=performance.now();
  function step(timestamp){
    let progress=Math.min((timestamp-startTime)/duration,1);
    activityChart.data.datasets.forEach((ds,i)=>{
      ds.data=activityChart.data.labels.map(_=>{
        let elapsed=year-new Date().getFullYear();
        return activities[i].ratePerSecond*elapsed*365*24*3600*progress;
      });
    });
    activityChart.update('none');
    if(progress<1) requestAnimationFrame(step);
    else animateDots();
  }
  requestAnimationFrame(step);
}

function animateDots(){
  const speed=0.05;
  function step(){
    activityChart.data.datasets.forEach((ds,i)=>{
      dotProgress[i]+=speed;
      if(dotProgress[i]>ds.data.length-1) dotProgress[i]=0;
    });
    activityChart.update('none');
    animationId=requestAnimationFrame(step);
  }
if (animationId) cancelAnimationFrame(animationId);
step();

}

function updateChart(){ if(!activityChart) return; animateChartGrowth(); }

const chartModalEl=document.getElementById('chartModal');
chartModalEl.addEventListener('shown.bs.modal',()=>{ if(!activityChart) createChart(); else updateChart(); });

document.getElementById("searchInput").addEventListener("input",renderActivities);
document.getElementById("filterCategory").addEventListener("change",renderActivities);
document.getElementById("sortRate").addEventListener("click",()=>{sortDescending=!sortDescending;renderActivities();});
timeline.addEventListener("input",renderActivities);

// Live update for current year
setInterval(()=>{ if(parseInt(timeline.value)===new Date().getFullYear()) renderActivities(); },1000);

// Initial render
//renderActivities();

export { renderActivities };