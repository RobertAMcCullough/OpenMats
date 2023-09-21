//returns a string in mySQL timestamp format in MST
export default () => {
  let MSTdate = new Date();
  MSTdate.setHours(MSTdate.getHours() - 7); // this date will be passed to the put request in 'updatedAt', subtracting 7 hours sets it to MST time

  return MSTdate.toISOString().slice(0, 19).replace('T', ' ');
};
