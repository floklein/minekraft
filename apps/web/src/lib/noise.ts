// Simple noise implementation for terrain generation
export class SimplexNoise {
  private p = [
    151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140,
    36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120,
    234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33,
    88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71,
    134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133,
    230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161,
    1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130,
    116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250,
    124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227,
    47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44,
    154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98,
    108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34,
    242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14,
    239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121,
    50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243,
    141, 128, 195, 78, 66, 215, 61, 156, 180,
  ];

  private perm: number[];

  constructor(seed = 0) {
    this.perm = new Array(512);
    this.seed(seed);
  }

  private seed(seedValue: number) {
    let normalizedSeed = seedValue;
    if (normalizedSeed > 0 && normalizedSeed < 1) {
      normalizedSeed *= 65536;
    }
    normalizedSeed = Math.floor(normalizedSeed);
    if (normalizedSeed < 256) {
      normalizedSeed |= normalizedSeed << 8;
    }

    for (let i = 0; i < 256; i++) {
      const v =
        i & 1
          ? this.p[i] ^ (normalizedSeed & 255)
          : this.p[i] ^ ((normalizedSeed >> 8) & 255);
      this.perm[i] = this.perm[i + 256] = v;
    }
  }

  private fade(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  private lerp(a: number, b: number, t: number): number {
    return (1 - t) * a + t * b;
  }

  private grad(hash: number, x: number, y: number, z: number): number {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }

  noise3D(x: number, y: number, z: number): number {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const Z = Math.floor(z) & 255;

    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);
    const zf = z - Math.floor(z);

    const u = this.fade(xf);
    const v = this.fade(yf);
    const w = this.fade(zf);

    const A = this.perm[X] + Y;
    const AA = this.perm[A] + Z;
    const AB = this.perm[A + 1] + Z;
    const B = this.perm[X + 1] + Y;
    const BA = this.perm[B] + Z;
    const BB = this.perm[B + 1] + Z;

    return this.lerp(
      this.lerp(
        this.lerp(
          this.grad(this.perm[AA], xf, yf, zf),
          this.grad(this.perm[BA], xf - 1, yf, zf),
          u,
        ),
        this.lerp(
          this.grad(this.perm[AB], xf, yf - 1, zf),
          this.grad(this.perm[BB], xf - 1, yf - 1, zf),
          u,
        ),
        v,
      ),
      this.lerp(
        this.lerp(
          this.grad(this.perm[AA + 1], xf, yf, zf - 1),
          this.grad(this.perm[BA + 1], xf - 1, yf, zf - 1),
          u,
        ),
        this.lerp(
          this.grad(this.perm[AB + 1], xf, yf - 1, zf - 1),
          this.grad(this.perm[BB + 1], xf - 1, yf - 1, zf - 1),
          u,
        ),
        v,
      ),
      w,
    );
  }

  noise2D(x: number, y: number): number {
    return this.noise3D(x, y, 0);
  }
}
