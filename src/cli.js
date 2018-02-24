module.exports = function CLI(Application){
  const vorpal = require('vorpal')();
  vorpal.delimiter(Application.meta.name+":"+Application.meta.version+"$").show();

  vorpal
    .command("gen <filename>")
    .option('-N, --no-num', 'dont use numbers for each enigma code word')
    .option('-T, --no-trans', 'dont use translations')
    .option('-W, --no-word', 'dont use found word, only use translation(s)')
    .option('-o, --output', 'output the source once completed')
    .description("create the BTCrecover file")
    .action(Application.createBTCRecoverFile);

  return vorpal;
};