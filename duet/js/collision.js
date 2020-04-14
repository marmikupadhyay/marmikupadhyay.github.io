export default function collisionDetection(duet, obj) {
  var x = 0;
  var y = 0;
  if (
    duet.position[0].y + duet.width >= obj.position.y &&
    duet.position[0].y <= obj.position.y + obj.height &&
    duet.position[0].x + duet.width > obj.position.x &&
    duet.position[0].x < obj.position.x + obj.width
  ) {
    x = 1;
    console.log(duet.position[0].y + duet.width >= obj.position.y);
    console.log(duet.position[0].y <= obj.position.y + obj.height);
    console.log(duet.position[0].x + duet.width > obj.position.x);
    console.log(duet.position[0].x < obj.position.x + obj.width);
  }
  if (
    duet.position[1].y + duet.width >= obj.position.y &&
    duet.position[1].y <= obj.position.y + obj.height &&
    duet.position[1].x > obj.position.x &&
    duet.position[1].x < obj.position.x + obj.width
  ) {
    y = 1;
    console.log(2);
  }
  if (x || y) return true;
  else return false;
}
