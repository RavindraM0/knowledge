import('./src/server.js').catch(e => {
    console.error("ERROR CAUGHT:");
    console.error(e.message);
    console.error(e.stack);
});
