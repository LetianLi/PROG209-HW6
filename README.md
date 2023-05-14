# PROG209-HW6

A task manager extended in functionality from last week's collaboration with Nicholas Jones.

## Instructions:

This week’s Version 1 requirements are:

1. You need a home page. It does not need any fancy function; it just needs to make it very clear what this web site does.
2. One page must allow the user to enter real data which is used to create an object which is then stored in the array. Your objects must have a random, unique ID property, which should most likely be defined as a property in the constructor as `this.ID = Math.random().toString(16).slice(5);`
3. One display page must display the data from the array using `<li>` elements. You can decide which properties of the objects you want to display; you might not want to display all of them. You should be using a `pagebeforeshow` event so that when a user navigates to the display page, the data is there already. The user should not have to click a button to get the list to show up.
4. You need to have a 4th page that does something else with the data. This page should make it clear what it “will do” but it doesn’t have to work this week. In Version 2 you will need to have your display page with `<li>` elements that are clickable, and each one should do something unique relative to that particular `<li>`. In my Movie app, my `<li>` elements take you to a new page, which shows the details (all the properties) for one particular object (Movie). You can do something different, as long as each `<li>` does or displays something unique for that `<li>`. Again, make it clear what your 4th page will be with bit of HTML, but it doesn’t have to work this week.
5. Your pages all must have appropriate navigation buttons.

Do not spend time doing CSS things, next week we will learn to use themeroller to build
our CSS.
