import initApp from "./index";
const port = process.env.PORT;

initApp().then((app) => {
    app.listen(port, () => {
    console.log(`Posts app listening at http://localhost:${port}`);
});
});