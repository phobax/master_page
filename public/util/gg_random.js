class Random {
  constructor (N=4096) {
    this.N = N;
    this.cnt = 0;
    this.RND = new Uint8ClampedArray(this.N);
    for (var i=0; i<this.N; i++) {
      this.RND[i] = Math.floor(Math.random()*255);
    }
  }

  rand256 (offset=0) {
    this.cnt += 1;
    return this.RND[((this.cnt+offset)|0)%(this.N)];
  }
}

export {Random}
