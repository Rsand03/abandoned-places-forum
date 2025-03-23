# Abandoned places forum

## Original separate FE and BE repositories

- [abandoned-places-forum-FE](https://github.com/Rsand03/abandoned-places-forum-FE)
- [abandoned-places-forum-BE](https://github.com/Rsand03/abandoned-places-forum-BE)

## Overview
This project aims to create an interactive map that displays both public and private abandoned locations. Each location can be tagged with labels like "visited" or "remember", allowing users to categorize and track their experiences. Every abandoned location will include details such as name, location, categories, condition, accessibility, and additional notes. Public places are visible to all users (that have enough points), while private locations are only accessible to the user who added them. Users can freely add private places, while adding public places requires making a publishing request that admins can either approve or decline. This helps maintain map quality and avoid spam. If the publishing request is accepted, the user will get some points, which grant access to "more secret" locations on the public map.

Main page of the application features an interactive map, where users can switch between many different layers. For example a high quality aerophoto, relief and other common layers included in the official application of Estonian Land Board (Maa-Amet). What stands out the most is the integration of oblique aerophotos service - users can access all useful geospatial data in one place, without the need to switch between different map applications.

In the map view, users can filter visible locations by visibility (public/private), categories, and the tags they’ve assigned. Clicking on a location opens a sidebar with detailed information, including a link to a subpage dedicated to that place. This subpage contains posts and discussions about the location, including images, comments, and upvotes. Private locations can be deleted from the details view, while public locations can be modified only by admins. The project provides a user-friendly platform to explore, document, and discuss abandoned places while ensuring proper privacy and data management.

## Status

Work in progress. Base functionality is implemented, currently working on minor extra features. Aiming to deploy the application in May/June.

## Used technologies

Refer to READMEs in both backend and frontend folder
