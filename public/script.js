function maskPassword(pass){
    let str = ""
    for (let index = 0; index < pass.length; index++) {
        str  += "*"
    }
    return str
}

function copyText(txt) {
    navigator.clipboard.writeText(txt).then(
        () => {
          /* clipboard successfully set */
        document.getElementById("alert").style.display = "inline"
        setTimeout(() => {
            document.getElementById("alert").style.display = "none"
            }, 2000);

        },
        () => {
          /* clipboard write failed */
        alert("Clipboard copying failed")
        },
    );
}

const deletePassword = (website)=>{
    fetch('/delete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ website: website }),
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        showPasswords();
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

// Logic to fill the table
const showPasswords = () => {
    let tb = document.querySelector("#passwordTable")
    fetch('/passwords')
    .then(response => response.json())
    .then(data => {
        if (data.length == 0) {
            tb.innerHTML = "No Data To Show"
        }
        else {
            tb.innerHTML =  `<tr>
                <th>Website</th>
                <th>Username</th>
                <th>Password</th>
                <th>Delete</th>
            </tr> `
            let str = ""
            data.forEach(element => {
                str += `<tr>
                    <td>${element.website} <img onclick="copyText('${element.website}')" src="./copy.svg" alt="Copy Button" width="10" width="10" height="10">
                    </td>
                    <td>${element.username} <img onclick="copyText('${element.username}')" src="./copy.svg" alt="Copy Button" width="10" width="10" height="10">
                    </td>
                    <td>${maskPassword(element.password)} <img onclick="copyText('${element.password}')" src="./copy.svg" alt="Copy Button" width="10" width="10" height="10">
                    </td>
                    <td><button class="btnsm" onclick="deletePassword('${element.website}')">Delete</button></td>
                </tr>`
            });
            tb.innerHTML = tb.innerHTML + str
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

console.log("Working");
showPasswords()

document.getElementById("passwordForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
        website: formData.get("website"),
        username: formData.get("username"),
        password: formData.get("password")
    };
    fetch('/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        showPasswords();
        document.getElementById("passwordForm").reset();
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});
