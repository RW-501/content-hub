
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
//         opacity: 0; transform: translateY(20px); transition: all 0.5s ease, transform 0.5s ease;

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
  { id:"waterConsumed", name:"Liters of Water Drunk", ratePerSecond:5000, category:"Health", description:"Liters of water consumed worldwide per second.", unit:"liters" },
,
  // === Population ===
  { id:"popGrowth", name:"Population Growth", ratePerSecond:2.5, category:"Population", description:"Net increase in global population per second.", unit:"people" },
  { id:"urbanization", name:"People Moving to Cities", ratePerSecond:2.1, category:"Population", description:"People moving to urban areas worldwide per second.", unit:"people" },
  { id:"refugees", name:"New Refugees", ratePerSecond:0.02, category:"Population", description:"People becoming refugees per second worldwide.", unit:"people" },
  { id:"migrants", name:"International Migrants", ratePerSecond:0.5, category:"Population", description:"People migrating across borders per second.", unit:"people" },
  { id:"heartbeats", name:"Total Human Heartbeats", ratePerSecond:500000000, category:"Population", description:"Collective human heartbeats worldwide per second.", unit:"beats" },

  // === Technology ===
  { id:"tweets", name:"Tweets Sent", ratePerSecond:6000, category:"Technology", description:"Tweets posted on X/Twitter per second.", unit:"tweets" },
  { id:"tiktoks", name:"TikTok Videos Watched", ratePerSecond:34000, category:"Technology", description:"TikTok videos viewed worldwide per second.", unit:"views" },
  { id:"facebookLikes", name:"Facebook Likes", ratePerSecond:42000, category:"Technology", description:"Facebook likes given per second.", unit:"likes" },
  { id:"snapchats", name:"Snapchat Snaps", ratePerSecond:20000, category:"Technology", description:"Snapchat snaps shared per second.", unit:"snaps" },
  { id:"zoom", name:"Zoom Meeting Minutes", ratePerSecond:120000, category:"Technology", description:"Zoom meeting minutes happening per second worldwide.", unit:"minutes" },

  // === Economy ===
  { id:"stocks", name:"Stock Trades", ratePerSecond:9000, category:"Economy", description:"Stock trades worldwide per second.", unit:"trades" },
  { id:"cryptoTx", name:"Crypto Transactions", ratePerSecond:1000, category:"Economy", description:"Cryptocurrency transactions per second.", unit:"transactions" },
  { id:"amazon", name:"Amazon Purchases", ratePerSecond:4100, category:"Economy", description:"Items purchased on Amazon per second.", unit:"items" },
  { id:"lottery", name:"Lottery Tickets Bought", ratePerSecond:120, category:"Economy", description:"Lottery tickets purchased per second worldwide.", unit:"tickets" },
  { id:"adSpending", name:"Ad Dollars Spent Online", ratePerSecond:3000, category:"Economy", description:"Ad spending online per second.", unit:"$" },

  // === Food & Drink ===
  { id:"alcohol", name:"Alcoholic Drinks", ratePerSecond:450, category:"Food & Drink", description:"Alcoholic drinks consumed worldwide per second.", unit:"drinks" },
  { id:"chocolate", name:"Chocolate Bars Eaten", ratePerSecond:70, category:"Food & Drink", description:"Chocolate bars eaten per second worldwide.", unit:"bars" },
  { id:"sandwiches", name:"Sandwiches Eaten", ratePerSecond:300, category:"Food & Drink", description:"Sandwiches eaten worldwide per second.", unit:"sandwiches" },
  { id:"fruits", name:"Fruits Eaten", ratePerSecond:2000, category:"Food & Drink", description:"Fruits consumed worldwide per second.", unit:"fruits" },
  { id:"beer", name:"Beer Drunk", ratePerSecond:1000, category:"Food & Drink", description:"Glasses of beer consumed per second worldwide.", unit:"glasses" },

  // === Entertainment ===
  { id:"netflix", name:"Netflix Hours Watched", ratePerSecond:27000, category:"Entertainment", description:"Hours of Netflix watched worldwide per second.", unit:"hours" },
  { id:"spotify", name:"Spotify Streams", ratePerSecond:120000, category:"Entertainment", description:"Songs streamed on Spotify per second.", unit:"streams" },
  { id:"booksSold", name:"Books Sold", ratePerSecond:9, category:"Entertainment", description:"Books sold worldwide per second.", unit:"books" },
  { id:"boardGames", name:"Board Games Played", ratePerSecond:0.5, category:"Entertainment", description:"Board games started per second worldwide.", unit:"games" },
  { id:"sportsTickets", name:"Sports Tickets Sold", ratePerSecond:4, category:"Entertainment", description:"Tickets sold for sporting events per second worldwide.", unit:"tickets" },

  // === Environment ===
  { id:"forestLoss", name:"Forest Loss", ratePerSecond:0.1, category:"Environment", description:"Hectares of forest lost per second worldwide.", unit:"hectares" },
  { id:"airPollution", name:"Air Pollution Deaths", ratePerSecond:0.2, category:"Environment", description:"Deaths caused by air pollution per second.", unit:"deaths" },
  { id:"fishCaught", name:"Fish Caught", ratePerSecond:1000, category:"Environment", description:"Fish caught worldwide per second.", unit:"fish" },
  { id:"meat", name:"Meat Consumed", ratePerSecond:700, category:"Environment", description:"Kg of meat consumed worldwide per second.", unit:"kg" },
  { id:"electricity", name:"Electricity Used", ratePerSecond:630000, category:"Environment", description:"Kilowatt-hours of electricity consumed per second.", unit:"kWh" },

  // === Health ===
  { id:"cigarettes", name:"Cigarettes Smoked", ratePerSecond:1000, category:"Health", description:"Cigarettes smoked worldwide per second.", unit:"cigarettes" },
  { id:"hospitalBeds", name:"Hospital Beds Occupied", ratePerSecond:200, category:"Health", description:"Hospital beds filled worldwide per second.", unit:"beds" },
  { id:"donations", name:"Blood Donations", ratePerSecond:2.5, category:"Health", description:"Blood donations given worldwide per second.", unit:"donations" },
  { id:"surgeries", name:"Surgeries Performed", ratePerSecond:1.5, category:"Health", description:"Surgeries performed worldwide per second.", unit:"surgeries" },
  { id:"condoms", name:"Condoms Used", ratePerSecond:140, category:"Health", description:"Condoms used worldwide per second.", unit:"condoms" },

  // === Transport ===
  { id:"oil", name:"Barrels of Oil Used", ratePerSecond:1000, category:"Transport", description:"Barrels of oil consumed worldwide per second.", unit:"barrels" },
  { id:"gasoline", name:"Liters of Gasoline Used", ratePerSecond:44000, category:"Transport", description:"Liters of gasoline consumed per second.", unit:"liters" },
  { id:"bikeShares", name:"Bike Share Rides", ratePerSecond:15, category:"Transport", description:"Bike-sharing rides started per second worldwide.", unit:"rides" },
  { id:"evs", name:"EVs Sold", ratePerSecond:0.2, category:"Transport", description:"Electric vehicles sold per second worldwide.", unit:"cars" },
  { id:"trafficJams", name:"Cars Stuck in Traffic", ratePerSecond:20000, category:"Transport", description:"Cars delayed in traffic worldwide per second.", unit:"cars" },

  // === Miscellaneous ===
  { id:"photos", name:"Photos Taken", ratePerSecond:10000, category:"Misc", description:"Photos taken worldwide per second.", unit:"photos" },
  { id:"selfies", name:"Selfies Taken", ratePerSecond:1000, category:"Misc", description:"Selfies taken per second worldwide.", unit:"selfies" },
  { id:"dogBarks", name:"Dog Barks", ratePerSecond:5000, category:"Misc", description:"Dog barks worldwide per second.", unit:"barks" },
  { id:"catMeows", name:"Cat Meows", ratePerSecond:6000, category:"Misc", description:"Cat meows worldwide per second.", unit:"meows" },
  { id:"kisses", name:"Kisses Shared", ratePerSecond:1200, category:"Misc", description:"Kisses shared per second worldwide.", unit:"kisses" },

  ,
  
  // === Population / Society ===
  { id:"schoolEnroll", name:"Children Enrolled in School", ratePerSecond:10, category:"Population", description:"Children enrolling in school worldwide per second.", unit:"children" },
  { id:"graduates", name:"Students Graduating", ratePerSecond:0.6, category:"Population", description:"Students graduating from higher education per second worldwide.", unit:"graduates" },
  { id:"prisoners", name:"Prison Sentences", ratePerSecond:0.08, category:"Population", description:"New people sentenced to prison per second worldwide.", unit:"people" },
  { id:"homeless", name:"People Becoming Homeless", ratePerSecond:0.15, category:"Population", description:"New people becoming homeless worldwide per second.", unit:"people" },
  { id:"petAdoptions", name:"Pets Adopted", ratePerSecond:0.5, category:"Population", description:"Pets adopted per second worldwide.", unit:"pets" },

  // === Technology / Internet ===
  { id:"domainRegs", name:"Domain Names Registered", ratePerSecond:1.5, category:"Technology", description:"New domain names registered per second.", unit:"domains" },
  { id:"websites", name:"Websites Created", ratePerSecond:0.6, category:"Technology", description:"New websites created per second.", unit:"websites" },
  { id:"cyberAttacks", name:"Cyber Attacks", ratePerSecond:115, category:"Technology", description:"Cyber attacks attempted worldwide per second.", unit:"attacks" },
  { id:"aiQueries", name:"AI Queries Made", ratePerSecond:8000, category:"Technology", description:"Queries processed by AI systems per second worldwide.", unit:"queries" },
  { id:"onlineVideos", name:"Videos Uploaded Online", ratePerSecond:120, category:"Technology", description:"New videos uploaded online per second.", unit:"videos" },

  // === Economy / Work ===
  { id:"newBusinesses", name:"Businesses Started", ratePerSecond:0.3, category:"Economy", description:"New businesses registered per second worldwide.", unit:"businesses" },
  { id:"bankAccounts", name:"New Bank Accounts", ratePerSecond:1.2, category:"Economy", description:"Bank accounts opened per second worldwide.", unit:"accounts" },
  { id:"jobApps", name:"Job Applications", ratePerSecond:18, category:"Economy", description:"Job applications submitted per second worldwide.", unit:"applications" },
  { id:"gigWork", name:"Gig Jobs Taken", ratePerSecond:7, category:"Economy", description:"Gig jobs accepted per second worldwide.", unit:"jobs" },
  { id:"creditCards", name:"Credit Cards Issued", ratePerSecond:0.4, category:"Economy", description:"Credit cards issued per second worldwide.", unit:"cards" },

  // === Food & Agriculture ===
  { id:"bread", name:"Slices of Bread Eaten", ratePerSecond:12000, category:"Food & Drink", description:"Bread slices consumed worldwide per second.", unit:"slices" },
  { id:"eggs", name:"Eggs Eaten", ratePerSecond:2400, category:"Food & Drink", description:"Eggs consumed per second worldwide.", unit:"eggs" },
  { id:"rice", name:"Bowls of Rice Eaten", ratePerSecond:2000, category:"Food & Drink", description:"Bowls of rice consumed worldwide per second.", unit:"bowls" },
  { id:"milk", name:"Glasses of Milk Drunk", ratePerSecond:1200, category:"Food & Drink", description:"Glasses of milk consumed per second worldwide.", unit:"glasses" },
  { id:"cheese", name:"Cheese Slices Eaten", ratePerSecond:500, category:"Food & Drink", description:"Slices of cheese eaten per second worldwide.", unit:"slices" },

  // === Entertainment & Media ===
  { id:"podcasts", name:"Podcast Episodes Played", ratePerSecond:600, category:"Entertainment", description:"Podcast episodes streamed per second worldwide.", unit:"episodes" },
  { id:"photosShared", name:"Photos Shared Online", ratePerSecond:8000, category:"Entertainment", description:"Photos shared on the internet per second.", unit:"photos" },
  { id:"memes", name:"Memes Shared", ratePerSecond:400, category:"Entertainment", description:"Memes shared per second worldwide.", unit:"memes" },
  { id:"ebooks", name:"Ebooks Downloaded", ratePerSecond:25, category:"Entertainment", description:"Ebooks downloaded worldwide per second.", unit:"ebooks" },
  { id:"boardStreams", name:"Game Streams Watched", ratePerSecond:9000, category:"Entertainment", description:"Game livestream minutes watched per second worldwide.", unit:"minutes" },

  // === Environment / Nature ===
  { id:"honey", name:"Honey Bees Born", ratePerSecond:24000, category:"Environment", description:"Honey bees born per second worldwide.", unit:"bees" },
  { id:"speciesLost", name:"Species Lost", ratePerSecond:0.0001, category:"Environment", description:"Species going extinct per second worldwide.", unit:"species" },
  { id:"glaciers", name:"Glacier Ice Lost", ratePerSecond:12000, category:"Environment", description:"Kg of glacier ice lost per second worldwide.", unit:"kg" },
  { id:"forestFires", name:"Forest Fires Started", ratePerSecond:0.005, category:"Environment", description:"New forest fires ignited per second worldwide.", unit:"fires" },
  { id:"soilLoss", name:"Soil Eroded", ratePerSecond:2500, category:"Environment", description:"Tons of soil eroded per second worldwide.", unit:"tons" },

  // === Health & Lifestyle ===
  { id:"sneezes", name:"Sneezes", ratePerSecond:3500, category:"Health", description:"Sneezes occurring worldwide per second.", unit:"sneezes" },
  { id:"yawns", name:"Yawns", ratePerSecond:800, category:"Health", description:"Yawns worldwide per second.", unit:"yawns" },
  { id:"handWashes", name:"Hand Washes", ratePerSecond:600, category:"Health", description:"Hand washes per second worldwide.", unit:"washes" },
  { id:"teethBrushed", name:"Teeth Brushed", ratePerSecond:400, category:"Health", description:"Toothbrushes in use per second worldwide.", unit:"brushes" },
  { id:"workouts", name:"Workouts Started", ratePerSecond:50, category:"Health", description:"Workout sessions starting per second worldwide.", unit:"sessions" },

  // === Transport & Travel ===
  { id:"busRides", name:"Bus Passengers", ratePerSecond:1800, category:"Transport", description:"Passengers boarding buses per second worldwide.", unit:"passengers" },
  { id:"taxiRides", name:"Taxi Rides", ratePerSecond:300, category:"Transport", description:"Taxi rides started per second worldwide.", unit:"rides" },
  { id:"motorcycles", name:"Motorcycles on Roads", ratePerSecond:600, category:"Transport", description:"Motorcycles in use per second worldwide.", unit:"motorcycles" },
  { id:"cruises", name:"Cruise Ship Travelers", ratePerSecond:0.1, category:"Transport", description:"People boarding cruise ships per second worldwide.", unit:"passengers" },
  { id:"eScooters", name:"E-Scooter Trips", ratePerSecond:40, category:"Transport", description:"E-scooter rides started per second worldwide.", unit:"rides" },

  // === Miscellaneous / Fun ===
  { id:"handshakes", name:"Handshakes", ratePerSecond:250, category:"Misc", description:"Handshakes happening per second worldwide.", unit:"handshakes" },
  { id:"hugs", name:"Hugs", ratePerSecond:500, category:"Misc", description:"Hugs given per second worldwide.", unit:"hugs" },
  { id:"claps", name:"Claps", ratePerSecond:3000, category:"Misc", description:"Claps worldwide per second.", unit:"claps" },
  { id:"laughs", name:"Laughs", ratePerSecond:2000, category:"Misc", description:"Laughs per second worldwide.", unit:"laughs" },
  { id:"winks", name:"Winks", ratePerSecond:150, category:"Misc", description:"Winks exchanged per second worldwide.", unit:"winks" },
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


let elapsedSeconds = 0; // start at 0
let timerId = null;
let sortDescending = false;

// Format numbers with shorthand
function formatNumber(num) {
  if (typeof num !== "number" || isNaN(num)) return "0"; 
  if (num > 1e9) return (num / 1e9).toFixed(2) + "B";
  if (num > 1e6) return (num / 1e6).toFixed(2) + "M";
  if (num > 1e3) return (num / 1e3).toFixed(1) + "K";
  return num.toFixed(0);
}



// Initialize activity counters
activities.forEach(a => a.current = 0);

// Render activity cards (does not update counts)
function renderActivities() {
    console.log("render");

  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  const filterCat = document.getElementById("filterCategory").value;

  const container = document.getElementById("activities");
  container.innerHTML = "";

  let filtered = activities.filter(a =>
    (!filterCat || a.category === filterCat) &&
    (!searchTerm || a.name.toLowerCase().includes(searchTerm) || a.description.toLowerCase().includes(searchTerm))
  );

  if (sortDescending) filtered.sort((a, b) => b.ratePerSecond - a.ratePerSecond);

  filtered.forEach(a => {
    const card = document.createElement("div");
    card.className = "col";
    card.innerHTML = `
      <div class="activity-card" data-activity="${a.id}">
        <h5>${a.name} <span class="badge bg-secondary category-badge">${a.category}</span></h5>
        <p>${a.description}</p>
        <p><i class="bi bi-calculator"></i> Count: <span class="count" data-value="${a.current}">${formatNumber(a.current)}</span> ${a.unit}</p>
      </div>`;
      console.log("Rendering activities:", activities.map(a => ({id: a.id, current: a.current})));

    container.appendChild(card);
  });

}

// Update counts each second
function tickActivities() {
  elapsedSeconds++;

  // Update elapsed time label
  const elapsedLabel = document.getElementById("elapsedLabel");
  if (elapsedLabel) {
    const hrs = Math.floor(elapsedSeconds / 3600);
    const mins = Math.floor((elapsedSeconds % 3600) / 60);
    const secs = elapsedSeconds % 60;
    elapsedLabel.textContent = `Elapsed Time: ${hrs}h ${mins}m ${secs}s`;
  }

  // Increment activity counts
  activities.forEach(a => {
    a.current += a.ratePerSecond;
    const el = document.querySelector(`.activity-card[data-activity="${a.id}"] .count`);
    if (el) el.textContent = formatNumber(a.current);
  });
}



// Start button
document.getElementById("startBTN").addEventListener("click", () => {
    console.log("Start?");
  if (timerId) clearInterval(timerId);
  console.log("yes");
      renderActivities();
  timerId = setInterval(tickActivities, 1000);
});

// Reset button
document.getElementById("resetBTN").addEventListener("click", () => {
        console.log("reset");

  if (timerId) clearInterval(timerId);
  timerId = null;
  elapsedSeconds = 0;
  activities.forEach(a => a.current = 0);
  renderActivities();
});

// Filters & sort
document.getElementById("searchInput").addEventListener("input", renderActivities);
document.getElementById("filterCategory").addEventListener("change", renderActivities);
document.getElementById("sortRate").addEventListener("click", () => {
  sortDescending = !sortDescending;
  renderActivities();
});

// Initial render
  renderActivities();


  timerId = setInterval(() => {
    tickActivities();
  }, 1000);


export { renderActivities };