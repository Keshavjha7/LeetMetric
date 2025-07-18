//Note: https://cors-anywhere.herokuapp.com/corsdemo
//Open the above link to get the temproary access to demo server

document.addEventListener("DOMContentLoaded", function(){

    const searchButton=document.getElementById("search-btn");
    const usernameInput=document.getElementById("user-input");
    const statsContainer=document.querySelector(".stats-container");
    const easyProgressCircle=document.querySelector(".easy-progress");
    const mediumProgressCircle=document.querySelector(".medium-progress");
    const hardProgressCircle=document.querySelector(".hard-progress");
    const easyLabel=document.getElementById("easy-label");
    const mediumLabel=document.getElementById("medium-label");
    const hardLabel=document.getElementById("hard-label");
    const cardStatsContainer=document.querySelector(".stats-card");


    function validateUsername(username){
        if(username.trim()==""){
            alert("username should not be empty");
            return false;
        }

        const regex=/^[a-zA-Z0-9_-]{1,15}$/;
        const isMatching=regex.test(username);
        if(!isMatching){
            alert("Invalid Username");
        }
        return isMatching;
    }

    async function fetchUserDetails(username) {
        
        try{
            searchButton.textContent="Searching..."
            searchButton.disabled=true;

            const proxyUrl='https://cors-anywhere.herokuapp.com/';
            const targetUrl='https://leetcode.com/graphql/';
            const myHeaders=new Headers();
            myHeaders.append("content-type","application/json");

            const graphql = JSON.stringify({
                query: "\n    query userSessionProgress($username: String!) {\n  allQuestionsCount {\n    difficulty\n    count\n  }\n  matchedUser(username: $username) {\n    submitStats {\n      acSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n      totalSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n    }\n  }\n}\n    ",
                variables: { "username": `${username}` }
            })
            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: graphql,
                //redirect: "follow"
            };

            const response=await fetch(proxyUrl+targetUrl, requestOptions);
            if(!response.ok){
                throw new Error("Unable to fetch the user details");
            }
            const parsedData=await response.json();
            console.log("Logging data: ",parsedData);

            displayUserData(parsedData);
        }
        catch(error){
            statsContainer.innerHTML=`<p>No data Found</p>`
        }
        finally{
            searchButton.textContent="Search";
            searchButton.disabled=false;
        }
    }

    function updateProgress(solved,total,label,circle){
        const progressDegree=(solved/total)*100;
        circle.style.setProperty("--progress-degree", `${progressDegree}%`);
        label.textContent=`${solved}/${total}`;
    }

    function displayUserData(parsedData){
        const totalQues=parsedData.data.allQuestionsCount[0].count;
        const totalEasyQues=parsedData.data.allQuestionsCount[1].count;
        const totalMediumQues=parsedData.data.allQuestionsCount[2].count;
        const totalHardQues=parsedData.data.allQuestionsCount[3].count;


        const solvedTotalQues=parsedData.data.matchedUser.submitStats.acSubmissionNum[0].count;
        const solvedTotalEasyQues=parsedData.data.matchedUser.submitStats.acSubmissionNum[1].count;
        const solvedTotalMediumQues=parsedData.data.matchedUser.submitStats.acSubmissionNum[2].count;
        const solvedTotalHardQues=parsedData.data.matchedUser.submitStats.acSubmissionNum[3].count;


        updateProgress(solvedTotalEasyQues,totalEasyQues,easyLabel,easyProgressCircle);
        updateProgress(solvedTotalMediumQues,totalMediumQues,mediumLabel,mediumProgressCircle);
        updateProgress(solvedTotalHardQues,totalHardQues,hardLabel,hardProgressCircle);
    }

    searchButton.addEventListener('click', function(){
        const username=usernameInput.value;
        if(validateUsername(username)){
            fetchUserDetails(username);
        }
    })

})