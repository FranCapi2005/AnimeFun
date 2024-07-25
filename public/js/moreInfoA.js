const container = document.getElementsByClassName("container__tab")
const links = document.getElementsByClassName("links")

function openTab(event, name){
    for(let i = 0; i<container.length; i++){
        container[i].style.display = "none";
    }
    
    for(let i = 0; i<links.length; i++){
        links[i].className = links[i].className.replace(" active", "");
    }

    document.getElementById(name).style.display = "block";
        event.currentTarget.className += " active";
}


const itemLink = document.querySelectorAll('.anime--info-list .item--link');

document.addEventListener("DOMContentLoaded", function() {
    itemLink.forEach(linkItem => {
        linkItem.textContent += ", "
    });
})