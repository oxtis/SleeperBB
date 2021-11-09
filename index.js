// import './style.css';
import nflplayer from './players.json';
// export { userMap };

// Write Javascript code!
const appDiv = document.getElementById('app');
appDiv.innerHTML = `<h1>JS Starter</h1>`;



// 519698783226023936
// bestBallCalc("523209686364766208")
// bestBallCalc("523065345105248256")
// bestBallCalc("490196857683701760")
// bestBallCalc("523229728710144000")
// bestBallCalc("529784074791366656")
// bestBallCalc("529760790529761280")
// bestBallCalc("523213564570980352")
// bestBallCalc("530173547800481792")
// bestBallCalc("530465468767469568")
// bestBallCalc("347158033576665088")
// bestBallCalc("530593525136420864")

var names = ["519698783226023936", "523209686364766208",
  "523065345105248256", "490196857683701760", "523229728710144000",
  "529784074791366656", "529760790529761280", "523213564570980352",
  "530173547800481792", "530465468767469568", "347158033576665088", "530593525136420864"]

for (let x of names) {
  calcWeek(9, x);
}

for (let x = 0; x < 10; x++) {
  // calcWeek(x, input_user)
}


function addScore(x) {
  total += x;
}
function calcWeek(week, input_user) {
  // variables
  var userMap = new Map(); // user_id, display_name
  var rosterMap = new Map(); // owner_id, roster_id, players, taxi
  var rosteredPlayers = new Map();


  // user
  function user() {
    this.user_id;
    this.display_name;
    this.roster_id;
    this.players;
    this.players_info = new Map();
    this.matchup;
  }

  function player(player_name, position, score) {
    this.player_name = player_name;
    this.position = position;
    this.score = score;
  }
  // 519700006104420352 - 2020
  // 650078285652377600 - 2021

  Promise.all([
    fetch('https://api.sleeper.app/v1/league/650078285652377600/users'),
    fetch('https://api.sleeper.app/v1/league/650078285652377600/rosters'),
    fetch('https://api.sleeper.app/v1/league/650078285652377600/matchups/' + week),
  ])
    .then(function (responses) {
      // Get a JSON object from each of the responses
      return Promise.all(
        responses.map(function (response) {
          return response.json();
        })
      );
    })
    .then(function (data) {
      // Log the data to the console
      // You would do something with both sets of data here
      for (let x in data) {
        let input = data[x];
        if (input[0].display_name != null) {
          // console.log("user----------------")
          // console.log(input);
          processUserData(input);
        } else if (input[0].settings != null) {
          // console.log("roster----------------")
          // console.log(input);
          processRosterData(input);
        } else if (input[0].players_points != null) {
          // console.log("matchup----------------")
          // console.log(input);
          processMatchUpPlayers(input);
          // processMatchUpData(input)
        }
      }

      // mapPlayersToUser()
      // console.log("--- WEEK " + week +  " TOP SCORES ---");
      let tmp = bestBallCalc(input_user)
      // console.log(tmp)
      // addScore(tmp)
      // console.log(total)
      // bestBallCalc("523209686364766208")
      // bestBallCalc("523065345105248256")
      // bestBallCalc("490196857683701760")
      // bestBallCalc("523229728710144000")
      // bestBallCalc("529784074791366656")
      // bestBallCalc("529760790529761280")
      // bestBallCalc("523213564570980352")
      // bestBallCalc("530173547800481792")
      // bestBallCalc("530465468767469568")
      // bestBallCalc("347158033576665088")
      // bestBallCalc("530593525136420864")

      // console.log(data);
    })
    .catch(function (error) {
      // if there's an error, log it
      console.log(error);
    });

  function processUserData(data) {
    for (var i = 0; i < data.length; i++) {
      userMap.set(data[i].user_id, data[i].display_name);
    }
  }

  function processMatchUpPlayers(data) {
    for (let match of data) {
      // console.log(match);

      for (let roster of rosterMap) {
        let roster_id = roster[1].roster_id;
        if (roster_id == match.roster_id) {
          let players = match.players;
          let taxi = roster[1].taxi;

          // current week players list without taxi
          players = players.filter(function (el) {
            return !taxi.includes(el);
          });


          for (let p of players) {
            let score = match.players_points[p]
            var tmp_player = new player(getPlayerName(p), getPlayerPosition(p), score);
            let player_info = roster[1].players_info;
            player_info.set(p, tmp_player);
          }

        }
      }
    }

  }

  function processRosterData(data) {
    for (var i = 0; i < data.length; i++) {
      var tmp_user = new user();

      // let players = data[i].players;
      let taxi = data[i].taxi;

      tmp_user.user_id = data[i].owner_id;
      tmp_user.display_name = userMap.get(data[i].owner_id);
      tmp_user.taxi = taxi;
      tmp_user.roster_id = data[i].roster_id;

      rosterMap.set(tmp_user.user_id, tmp_user);
    }
    // populatePlayersInfo();
  }

  function getPlayerName(player_id) {
    return nflplayer[player_id].full_name;
  }

  function getPlayerPosition(player_id) {
    return nflplayer[player_id].position;
  }

  function populatePlayersInfo() {
    for (let [key, value] of rosterMap) {
      for (let p of value.players) {
        var tmp_player = new player(getPlayerName(p), getPlayerPosition(p));
        let player_info = rosterMap.get(key).players_info;
        player_info.set(p, tmp_player);
      }
    }
  }

  function bestBallCalc(user_id) {

    var players = rosterMap.get(user_id).players_info;

    let qb;
    let qbName = '';
    let qbScore = 0;

    let rb1;
    let rb1Name = '';
    let rb1Score = 0;

    let rb2;
    let rb2Name = '';
    let rb2Score = 0;

    let wr1;
    let wr1Name = '';
    let wr1Score = 0;

    let wr2;
    let wr2Name = '';
    let wr2Score = 0;

    let wr3;
    let wr3Name = '';
    let wr3Score = 0;

    let te;
    let teName = '';
    let teScore = 0;

    let flex1;
    let flex1Name;
    let flex1Score = 0;

    let flex2;
    let flex2Name;
    let flex2Score = 0;

    let flex3;
    let flex3Name;
    let flex3Score = 0;

    let sflex;
    let sflexName;
    let sflexScore = 0;

    //TOP SCORE QB
    for (let player of players) {
      let tmp = player[1];
      if (tmp.position == 'QB' && tmp.score > qbScore) {
        qbScore = tmp.score;
        qbName = tmp.player_name;
        qb = player[0];
      }
    }

    players.delete(qb);

    //TOP SCORE RB1
    for (let player of players) {
      let tmp = player[1];
      if (tmp.position == 'RB' && tmp.score > rb1Score) {
        rb1Score = tmp.score;
        rb1Name = tmp.player_name;
        rb1 = player[0];
      }
    }

    players.delete(rb1);

    //TOP SCORE RB2
    for (let player of players) {
      let tmp = player[1];
      if (tmp.position == 'RB' && tmp.score > rb2Score) {
        rb2Score = tmp.score;
        rb2Name = tmp.player_name;
        rb2 = player[0];
      }
    }

    players.delete(rb2);

    //TOP SCORE WR1
    for (let player of players) {
      let tmp = player[1];
      if (tmp.position == 'WR' && tmp.score > wr1Score) {
        wr1Score = tmp.score;
        wr1Name = tmp.player_name;
        wr1 = player[0];
      }
    }

    players.delete(wr1);

    //TOP SCORE WR2
    for (let player of players) {
      let tmp = player[1];
      if (tmp.position == 'WR' && tmp.score > wr2Score) {
        wr2Score = tmp.score;
        wr2Name = tmp.player_name;
        wr2 = player[0];
      }
    }

    players.delete(wr2);

    //TOP SCORE WR3
    for (let player of players) {
      let tmp = player[1];
      if (tmp.position == 'WR' && tmp.score > wr3Score) {
        wr3Score = tmp.score;
        wr3Name = tmp.player_name;
        wr3 = player[0];
      }
    }

    players.delete(wr3);

    //TOP SCORE TE
    for (let player of players) {
      let tmp = player[1];
      if (tmp.position == 'TE' && tmp.score > teScore) {
        teScore = tmp.score;
        teName = tmp.player_name;
        te = player[0];
      }
    }

    players.delete(te);

    //TOP SCORE FLEX1
    for (let player of players) {
      let tmp = player[1];
      if (tmp.position != 'QB' && tmp.score > flex1Score) {
        flex1Score = tmp.score;
        flex1Name = tmp.player_name;
        flex1 = player[0];
      }
    }

    players.delete(flex1);

    //TOP SCORE FLEX2
    for (let player of players) {
      let tmp = player[1];
      if (tmp.position != 'QB' && tmp.score > flex2Score) {
        flex2Score = tmp.score;
        flex2Name = tmp.player_name;
        flex2 = player[0];
      }
    }

    players.delete(flex2);

    //TOP SCORE FLEX3
    for (let player of players) {
      let tmp = player[1];
      if (tmp.position != 'QB' && tmp.score > flex3Score) {
        flex3Score = tmp.score;
        flex3Name = tmp.player_name;
        flex3 = player[0];
      }
    }

    players.delete(flex3);

    //TOP SCORE SFLEX
    for (let player of players) {
      let tmp = player[1];
      if (tmp.score > sflexScore) {
        sflexScore = tmp.score;
        sflexName = tmp.player_name;
        sflex = player[0];
      }
    }

    players.delete(sflex);

    let totalScore =
      qbScore +
      rb1Score +
      rb2Score +
      wr1Score +
      wr2Score +
      wr3Score +
      teScore +
      flex1Score +
      flex2Score +
      flex3Score +
      sflexScore;

    console.log('Top Scoring QB: ' + qbName + ' - ' + qbScore);
    console.log('Top Scoring RB1: ' + rb1Name + ' - ' + rb1Score);
    console.log('Top Scoring RB2: ' + rb2Name + ' - ' + rb2Score);
    console.log('Top Scoring WR1: ' + wr1Name + ' - ' + wr1Score);
    console.log('Top Scoring WR2: ' + wr2Name + ' - ' + wr2Score);
    console.log('Top Scoring WR3: ' + wr3Name + ' - ' + wr3Score);
    console.log('Top Scoring TE: ' + teName + ' - ' + teScore);
    console.log('Top Scoring FLEX1: ' + flex1Name + ' - ' + flex1Score);
    console.log('Top Scoring FLEX2: ' + flex2Name + ' - ' + flex2Score);
    console.log('Top Scoring FLEX3: ' + flex3Name + ' - ' + flex3Score);
    console.log('Top Scoring SFLEX: ' + sflexName + ' - ' + sflexScore);
    console.log('For League Member: ' + rosterMap.get(user_id).display_name + ' Best Ball Score: ' + totalScore);

    var newdiv = document.createElement("div");
    var newdiv2 = document.createElement("div");
    var newdiv3 = document.createElement("div");
    const lineBreak = document.createElement('br');

    newdiv.innerHTML = 'For League Member: ' + rosterMap.get(user_id).display_name + '<br>';

    newdiv2.innerHTML = 
      'QB: ' + qbName + ' - ' + qbScore + '<br>' +
      'RB1: ' + rb1Name + ' - ' + rb1Score + '<br>' + 
      'RB2: ' + rb2Name + ' - ' + rb2Score + '<br>' +
      'WR1: ' + wr1Name + ' - ' + wr1Score + '<br>' +
      'WR2: ' + wr2Name + ' - ' + wr2Score + '<br>' +
      'WR3: ' + wr3Name + ' - ' + wr3Score + '<br>' +
      'TE: ' + teName + ' - ' + teScore + '<br>' +
      'FLEX1: ' + flex1Name + ' - ' + flex1Score + '<br>' +
      'FLEX2: ' + flex2Name + ' - ' + flex2Score + '<br>' +
      'FLEX3: ' + flex3Name + ' - ' + flex3Score + '<br>' +
      'SFLEX: ' + sflexName + ' - ' + sflexScore + '<br>';
    

      totalScore = totalScore.toFixed(2)

    newdiv3.innerHTML = ' Best Ball Score: ' + totalScore + '<br>' + '<br>';

    document.getElementById("app").appendChild(newdiv);
    document.getElementById("app").appendChild(newdiv2);
    document.getElementById("app").appendChild(newdiv3);

    return totalScore;
  }

  // QB, RB, RB, WR, WR, WR, TE, WRT, WRT, WRT, WRTQ
}


