import { quoteUrl } from "../Utils/Utilities";
import $ from "jquery"

// This function controls the end of page loading
export async function toggleFullPageLoader() {

    // Fetching user details custom endpiont
    
    if (process.env.REACT_APP_MODE !== 'DEV'){
        const response = await fetch(process.env.REACT_APP_SITEURL + 'userdetails/');
        if (response.status !== 200) {
            // If user is NOT authenticated, a redirection to the customlogin page is done
            document.location.href = process.env.REACT_APP_SITEURL + 'customlogin/?next=' + quoteUrl(window.location.href)
        }
    }

    // If user is authenticated (response code 200) or APP is in development mode
    // We make sure that user is authenticated against Geoserver via oauth2 endpoint
    await fetch(+ 'geoserver/web/j_spring_oauth2_geonode_login');
    // We show the app
    $('#preloader').hide();
    $('#app').show();

}