let teamsElement = document.getElementById("scores");

let teams = [];

let teamsAdded = 0;

function changeScore(team, player, amount)
{
    teams[team].players[player].score += amount;

    updateTeams();
}

function loadTeams()
{
    let loadedTeams = JSON.parse(window.localStorage.getItem("teams"));

    if(loadedTeams)
    {
        teams = loadedTeams;
    }
    
    let loadedTeamsAdded = window.localStorage.getItem("teamsAdded");
    
    if(loadedTeamsAdded)
    {
        teamsAdded = loadedTeamsAdded;
    }

    updateTeams();
}

function updateTeams()
{
    saveTeams();
    drawTeams();
}

function saveTeams()
{
    window.localStorage.setItem("teams", JSON.stringify(teams));
    window.localStorage.setItem("teamsAdded", teamsAdded)
}

function drawTeams()
{
    let template = "";

    for(let currentTeam = 0; currentTeam < teams.length; currentTeam++)
    {
        let teamScore = getTeamScore(teams[currentTeam].players);
        let teamsWidth = teams.length == 2 ? 6 : 12;

        // TODO make it look okay on mobile
        // FIXME collapse doesn't work if you click another button
        template += 
        `
        <div class="col-${teamsWidth} mt-2 mb-4 text-light">
            <div class="row bg-dark mx-2">
                <div class="col-12 my-2">
                    <div class="row justify-content-between my-2 mx-3" data-bs-toggle="collapse" data-bs-target="#disabled-team-${currentTeam}">
                        <div class="col">
                            <h2>${teams[currentTeam].name}</h2>
                        </div>
                        <div class="col text-end">
                            <h3>Team Score: ${teamScore}</h3>
                        </div>
                    </div>
                    <div class="disabled-collapse" id="team-${currentTeam}">
                        <div class="row justify-content-around mb-2">
                            <div class="col d-flex justify-content-center">
                                <button class="btn btn-primary" onclick="addPlayer(${currentTeam})">Add Player</button>
                            </div>
                            <div class="col d-flex justify-content-center">
                                <button class="btn btn-warning" onclick="renameTeam(${currentTeam})">Rename Team</button>
                            </div>
                        </div>
                        <div class="row justify-content-around mb-5">
                            <div class="col d-flex justify-content-center">
                                <button class="btn btn-secondary" onclick="resetTeamScore(${currentTeam})">Reset Team Score</button>
                            </div>
                            <div class="col d-flex justify-content-center">
                                <button class="btn btn-danger" onclick="deleteTeam(${currentTeam})">Delete Team</button>
                            </div>
                        </div>
                        <div class=${teams[currentTeam].players.length > 0 ? "player-divider" : ""}></div>
        `;
        
        for(let currentPlayer = 0; currentPlayer < teams[currentTeam].players.length; currentPlayer += 1)
        {
            template += 
            `
            <div class="row justify-content-between mt-5 pt-2">
                <div class="col-6">
                    <h3>${teams[currentTeam].players[currentPlayer].name}</h3>
                </div>
                <div class="col-6">
                    <div class="row justify-content-between">
                        <div class="col-6 d-flex justify-content-center">
                            <button class="btn btn-primary" onclick="changeScore(${currentTeam}, ${currentPlayer}, 2)">+2</button>
                        </div>
                        <div class="col-6 d-flex justify-content-center">
                            <button class="btn btn-primary" onclick="changeScore(${currentTeam}, ${currentPlayer}, 3)">+3</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row mt-2 pb-2 justify-content-between">
                <div class="col-6">
                    <h4>Player Score: ${teams[currentTeam].players[currentPlayer].score}</h4>
                </div>
                <div class="col-6">
                    <div class="row justify-content-between">
                        <div class="col-4 d-flex justify-content-center">
                            <button class="btn btn-warning" onclick="renamePlayer(${currentTeam}, ${currentPlayer})">Rename</button>
                        </div>
                        <div class="col-4 d-flex justify-content-center">
                            <button class="btn btn-secondary" onclick="resetPlayerScore(${currentTeam}, ${currentPlayer})">Zero Score</button>
                        </div>
                        <div class="col-4 d-flex justify-content-center">
                            <button class="btn btn-danger" onclick="deletePlayer(${currentTeam}, ${currentPlayer})">Delete</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="justify-self-center my-4 ${(currentPlayer + 1 < teams[currentTeam].players.length) ? "player-divider" : "" }"></div>
            `;
        }
        
        template +=
        `
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    teamsElement.innerHTML = template;
}

function getTeamScore(players)
{
    let score = 0;

    for(let i = 0; i < players.length; i++)
    {
        score += players[i].score;
    }

    return score;
}

function resetAllScores()
{
    for(let currentTeam = 0; currentTeam < teams.length; currentTeam++)
    {
        resetTeamScore(currentTeam);
    }

    updateTeams();
}

function resetTeamScore(team)
{
    for(let currentPlayer = 0; currentPlayer < teams[team].players.length; currentPlayer++)
    {
        resetPlayerScore(team, currentPlayer);
    }
    updateTeams();
}

function resetPlayerScore(team, player)
{
    teams[team].players[player].score = 0;

    updateTeams();
}

function renameTeam(team)
{
    let newName = window.prompt("Enter team name", teams[team].name);
    if(newName)
    {
        teams[team].name = newName;
    }

    updateTeams();
}

function renamePlayer(team, player)
{
    let newName = window.prompt("Enter player name", teams[team].players[player].name);
    if(newName)
    {
        teams[team].players[player].name = newName;
    }

    updateTeams();
}

function addTeam()
{
    let newTeam = { name: `New Team ${++teamsAdded}`, players: [], playersAdded: 0};
    teams.push(newTeam);

    updateTeams();
}

function addPlayer(team)
{
    let newPlayer = {name: `New Player ${++teams[team].playersAdded}`, score: 0};
    teams[team].players.push(newPlayer);

    updateTeams();
}

function deleteTeam(team)
{
    for(let i = team; i < teams.length; i++)
    {
        teams[i] = teams[i + 1];
    }
    
    teams.pop();
    
    updateTeams();
}

function deletePlayer(team, player)
{
    for(let i = player; i < teams[team].players.length; i++)
    {
        teams[team].players[i] = teams[team].players[i + 1];
    }
    
    teams[team].players.pop();

    updateTeams();
}

loadTeams();
updateTeams();