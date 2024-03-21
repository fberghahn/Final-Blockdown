/* eslint-disable */
 
/*!
 * tweedle.js - v2.1.0
 * Compiled Wed, 05 Apr 2023 15:21:25 UTC
 *
 * tweedle.js is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 * 
 * Copyright 2019-2021, Milton Candelero <miltoncandelero@gmail.com>, All Rights Reserved
 */
'use strict';

/**
 * Polyfilled function to get the current time in miliseconds.
 * It tries to use `process.hrtime()`, `performance.now()`, `Date.now()` or `new Date().getTime()` in that order.
 */
exports.NOW = void 0;

// Include a performance.now polyfill.
// In node.js, use process.hrtime.

// @ts-ignore
if (typeof self == "undefined" && typeof process !== "undefined" && process.hrtime) {
	exports.NOW = function () {
		// @ts-ignore
		const time = process.hrtime();

		// Convert [seconds, nanoseconds] to milliseconds.
		return time[0] * 1000 + time[1] / 1000000;
	};
}
// In a browser, use self.performance.now if it is available.
else if (typeof self !== "undefined" && self.performance !== undefined && self.performance.now !== undefined) {
	// This must be bound, because directly assigning this function
	// leads to an invocation exception in Chrome.
	exports.NOW = self.performance.now.bind(self.performance);
}
// Use Date.now if it is available.
else if (Date.now !== undefined) {
	exports.NOW = Date.now;
}
// Otherwise, use 'new Date().getTime()'.
else {
	exports.NOW = function () {
		return new Date().getTime();
	};
}

/**
 * A group is a class that allows you to manage many tweens from one place.
 *
 * A tween will ALWAYS belong to a group. If no group is assigned it will default to the static shared group: `Group.shared`.
 */
class Group {constructor() { Group.prototype.__init.call(this);Group.prototype.__init2.call(this);Group.prototype.__init3.call(this);Group.prototype.__init4.call(this); }
	 __init() {this._tweens

 = {};}

	

	/**
	 * A tween without an explicit group will default to this shared static one.
	 */
	 static get shared() {
		if (!Group._shared) {
			Group._shared = new Group();
		}
		return Group._shared;
	}

	 __init2() {this._paused = false;}

	/**
	 * A paused group will skip updating all the asociated tweens.
	 * _To control all tweens, use {@link Group.getAll} to get an array with all tweens._
	 * @returns returns true if this group is paused.
	 */
	 isPaused() {
		return this._paused;
	}

	/**
	 * Pauses this group. If a group was already paused, this has no effect.
	 * A paused group will skip updating all the asociated tweens.
	 * _To control all tweens, use {@link Group.getAll} to get an array with all tweens._
	 */
	 pause() {
		this._paused = true;
	}

	/**
	 * Resumes this group. If a group was not paused, this has no effect.
	 * A paused group will skip updating all the asociated tweens.
	 * _To control all tweens, use {@link Group.getAll} to get an array with all tweens._
	 */
	 resume() {
		this._paused = false;
	}

	 __init3() {this._lastUpdateTime = undefined;}

	/**
	 * Function used by the group to know what time is it.
	 * Used to calculate the deltaTime in case you call update without the parameter.
	 */
	 __init4() {this.now = exports.NOW;} // used to calculate deltatime in case you stop providing one

	/**
	 * Returns all the tweens in this group.
	 *
	 * _note: only **running** tweens are in a group._
	 * @returns all the running tweens.
	 */
	 getAll() {
		return Object.keys(this._tweens).map((tweenId) => this._tweens[tweenId]);
	}

	/**
	 * Removes all the tweens in this group.
	 *
	 * _note: this will not modify the group reference inside the tween object_
	 */
	 removeAll() {
		this._tweens = {};
	}

	/**
	 * Adds a tween to this group.
	 *
	 * _note: this will not modify the group reference inside the tween object_
	 * @param tween Tween to add.
	 */
	 add(tween) {
		this._tweens[tween.getId()] = tween;
	}

	/**
	 * Removes a tween from this group.
	 *
	 * _note: this will not modify the group reference inside the tween object_
	 * @param tween
	 */
	 remove(tween) {
		delete this._tweens[tween.getId()];
	}

	/**
	 * Updates all the tweens in this group.
	 *
	 * If a tween is stopped, paused, finished or non started it will be removed from the group.
	 *
	 *  Tweens are updated in "batches". If you add a new tween during an
	 *  update, then the new tween will be updated in the next batch.
	 *  If you remove a tween during an update, it may or may not be updated.
	 *  However, if the removed tween was added during the current batch,
	 *  then it will not be updated.
	 * @param deltaTime - Amount of **miliseconds** that have passed since last excecution. If not provided it will be calculated using the {@link Group.now} function
	 * @param preserve - Prevent the removal of stopped, paused, finished or non started tweens.
	 * @returns returns true if the group is not empty and it is not paused.
	 */
	 update(deltaTime, preserve = false) {
		// move forward the automatic dt if needed
		if (deltaTime == undefined) {
			// now varies from line to line, that's why I manually use 0 as dt
			if (this._lastUpdateTime == undefined) {
				this._lastUpdateTime = this.now();
				deltaTime = 0;
			} else {
				deltaTime = this.now() - this._lastUpdateTime;
			}
		}
		this._lastUpdateTime = this.now();

		// exit early if the entire group is paused
		if (this._paused) {
			return false;
		}

		const tweenIds = Object.keys(this._tweens);
		if (tweenIds.length == 0) {
			return false;
		}

		for (let i = 0; i < tweenIds.length; i++) {
			const tween = this._tweens[tweenIds[i]];

			// groups call the preserve with true because they like to delete themselves in a different way.
			if (tween && tween.update(deltaTime, true) == false && !preserve) {
				delete this._tweens[tweenIds[i]];
			}
		}

		return true;
	}
}

/**
 * The type for a function that takes a number between 0 and 1 and returns another number between 0 and 1
 */


/**
 * The Ease class provides a collection of easing functions.
 *
 * These functions take in a parameter between 0 and 1 as the ratio and give out a new ratio.
 *
 * These are [Robert Penner](http://www.robertpenner.com/easing_terms_of_use.html)'s optimized formulas.
 *
 * Need help picking one? [Check this out!](https://easings.net/)
 */
const Easing = {
	Step: {
		None(amount) {
			return amount < 0.5 ? 0 : 1;
		},
	},
	Linear: {
		None(amount) {
			return amount;
		},
	},
	Quadratic: {
		In(amount) {
			return amount * amount;
		},
		Out(amount) {
			return amount * (2 - amount);
		},
		InOut(amount) {
			if ((amount *= 2) < 1) {
				return 0.5 * amount * amount;
			}

			return -0.5 * (--amount * (amount - 2) - 1);
		},
	},
	Cubic: {
		In(amount) {
			return amount * amount * amount;
		},
		Out(amount) {
			return --amount * amount * amount + 1;
		},
		InOut(amount) {
			if ((amount *= 2) < 1) {
				return 0.5 * amount * amount * amount;
			}

			return 0.5 * ((amount -= 2) * amount * amount + 2);
		},
	},
	Quartic: {
		In(amount) {
			return amount * amount * amount * amount;
		},
		Out(amount) {
			return 1 - --amount * amount * amount * amount;
		},
		InOut(amount) {
			if ((amount *= 2) < 1) {
				return 0.5 * amount * amount * amount * amount;
			}

			return -0.5 * ((amount -= 2) * amount * amount * amount - 2);
		},
	},
	Quintic: {
		In(amount) {
			return amount * amount * amount * amount * amount;
		},
		Out(amount) {
			return --amount * amount * amount * amount * amount + 1;
		},
		InOut(amount) {
			if ((amount *= 2) < 1) {
				return 0.5 * amount * amount * amount * amount * amount;
			}

			return 0.5 * ((amount -= 2) * amount * amount * amount * amount + 2);
		},
	},
	Sinusoidal: {
		In(amount) {
			return 1 - Math.cos((amount * Math.PI) / 2);
		},
		Out(amount) {
			return Math.sin((amount * Math.PI) / 2);
		},
		InOut(amount) {
			return 0.5 * (1 - Math.cos(Math.PI * amount));
		},
	},
	Exponential: {
		In(amount) {
			return amount == 0 ? 0 : Math.pow(1024, amount - 1);
		},
		Out(amount) {
			return amount == 1 ? 1 : 1 - Math.pow(2, -10 * amount);
		},
		InOut(amount) {
			if (amount == 0) {
				return 0;
			}

			if (amount == 1) {
				return 1;
			}

			if ((amount *= 2) < 1) {
				return 0.5 * Math.pow(1024, amount - 1);
			}

			return 0.5 * (-Math.pow(2, -10 * (amount - 1)) + 2);
		},
	},
	Circular: {
		In(amount) {
			return 1 - Math.sqrt(1 - amount * amount);
		},
		Out(amount) {
			return Math.sqrt(1 - --amount * amount);
		},
		InOut(amount) {
			if ((amount *= 2) < 1) {
				return -0.5 * (Math.sqrt(1 - amount * amount) - 1);
			}

			return 0.5 * (Math.sqrt(1 - (amount -= 2) * amount) + 1);
		},
	},
	Elastic: {
		In(amount) {
			if (amount == 0) {
				return 0;
			}

			if (amount == 1) {
				return 1;
			}

			return -Math.pow(2, 10 * (amount - 1)) * Math.sin((amount - 1.1) * 5 * Math.PI);
		},
		Out(amount) {
			if (amount == 0) {
				return 0;
			}

			if (amount == 1) {
				return 1;
			}

			return Math.pow(2, -10 * amount) * Math.sin((amount - 0.1) * 5 * Math.PI) + 1;
		},
		InOut(amount) {
			if (amount == 0) {
				return 0;
			}

			if (amount == 1) {
				return 1;
			}

			amount *= 2;

			if (amount < 1) {
				return -0.5 * Math.pow(2, 10 * (amount - 1)) * Math.sin((amount - 1.1) * 5 * Math.PI);
			}

			return 0.5 * Math.pow(2, -10 * (amount - 1)) * Math.sin((amount - 1.1) * 5 * Math.PI) + 1;
		},
	},
	Back: {
		In(amount) {
			const s = 1.70158;

			return amount * amount * ((s + 1) * amount - s);
		},
		Out(amount) {
			const s = 1.70158;

			return --amount * amount * ((s + 1) * amount + s) + 1;
		},
		InOut(amount) {
			const s = 1.70158 * 1.525;

			if ((amount *= 2) < 1) {
				return 0.5 * (amount * amount * ((s + 1) * amount - s));
			}

			return 0.5 * ((amount -= 2) * amount * ((s + 1) * amount + s) + 2);
		},
	},
	Bounce: {
		In(amount) {
			return 1 - Easing.Bounce.Out(1 - amount);
		},
		Out(amount) {
			if (amount < 1 / 2.75) {
				return 7.5625 * amount * amount;
			} else if (amount < 2 / 2.75) {
				return 7.5625 * (amount -= 1.5 / 2.75) * amount + 0.75;
			} else if (amount < 2.5 / 2.75) {
				return 7.5625 * (amount -= 2.25 / 2.75) * amount + 0.9375;
			}

			return 7.5625 * (amount -= 2.625 / 2.75) * amount + 0.984375;
		},
		InOut(amount) {
			if (amount < 0.5) {
				return Easing.Bounce.In(amount * 2) * 0.5;
			}

			return Easing.Bounce.Out(amount * 2 - 1) * 0.5 + 0.5;
		},
	},
};

/**
 * The type for a function that picks a value by interpolating the elements of the array given.
 */


/**
 * Object containing common interpolation functions.
 * These functions can be passed in the {@link Tween.interpolation} argument and **will only affect fields where you gave an array as target value**
 */
const Interpolation = {
	/**
	 * Geometric interpolation functions. Good for interpolating positions in space.
	 */
	Geom: {
		/**
		 * Linear interpolation is like drawing straight lines between the points.
		 */
		Linear(v, k) {
			const m = v.length - 1;
			const f = m * k;
			const i = Math.floor(f);
			const fn = Interpolation.Utils.Linear;

			if (k < 0) {
				return fn(v[0], v[1], f);
			}

			if (k > 1) {
				return fn(v[m], v[m - 1], m - f);
			}

			return fn(v[i], v[i + 1 > m ? m : i + 1], f - i);
		},

		/**
		 * A Bézier curve is defined by a set of control points P0 through Pn, where n is called its order.
		 * The first and last control points are always the end points of the curve; however, the intermediate control points (if any) generally do not lie on the curve.
		 *
		 * https://en.wikipedia.org/wiki/B%C3%A9zier_curve#Explicit_definition
		 */
		Bezier(v, k) {
			let b = 0;
			const n = v.length - 1;
			const pw = Math.pow;
			const bn = Interpolation.Utils.Bernstein;

			for (let i = 0; i <= n; i++) {
				b += bn(n, i) * pw(1 - k, n - i) * pw(k, i) * v[i];
			}

			return b;
		},

		/**
		 * Assumes your points are a succession of quadratic bezier curves where the endpoint of one is the start point of the next one.
		 * for example: `[Point in the curve, Control point, Point in the curve, Control point, Point in the curve]`
		 */
		QuadraticBezier(v, k) {
			let b = 0;
			const n = v.length - 1;

			if (k == 1) {
				return v[n];
			}

			const pw = Math.pow;
			const bn = Interpolation.Utils.Bernstein;

			const f = n * k;
			const i = Math.floor(f);
			const t = (f - i) * 0.5 + 0.5 * (i % 2);
			const i0 = i - (i % 2);
			const i1 = i0 + 1;
			const i2 = i0 + 2;

			b += bn(2, 0) * pw(1 - t, 2 - 0) * pw(t, 0) * v[i0];
			b += bn(2, 1) * pw(1 - t, 2 - 1) * pw(t, 1) * v[i1];
			b += bn(2, 2) * pw(1 - t, 2 - 2) * pw(t, 2) * v[i2];

			return b;
		},

		/**
		 * Assumes your points are a succession of cubic bezier curves where the endpoint of one is the start point of the next one.
		 * for example: `[Point in the curve, Control point, Control point, Point in the curve, Control point, Control point, Point in the curve]`
		 */
		CubicBezier(v, k) {
			let b = 0;
			const n = v.length - 1;

			if (k == 1) {
				return v[n];
			}

			const pw = Math.pow;
			const bn = Interpolation.Utils.Bernstein;

			const f = n * k;
			const i = Math.floor(f);

			const t = (f - i) * (1 / 3) + (1 / 3) * (i % 3);

			const i0 = i - (i % 3);
			const i1 = i0 + 1;
			const i2 = i0 + 2;
			const i3 = i0 + 3;

			b += bn(3, 0) * pw(1 - t, 3 - 0) * pw(t, 0) * v[i0];
			b += bn(3, 1) * pw(1 - t, 3 - 1) * pw(t, 1) * v[i1];
			b += bn(3, 2) * pw(1 - t, 3 - 2) * pw(t, 2) * v[i2];
			b += bn(3, 3) * pw(1 - t, 3 - 3) * pw(t, 3) * v[i3];

			return b;
		},

		/**
		 * A Catmullrom spline is a curve where the original set of points is also used as control points.
		 * Usually Catmullrom splines need two extra elements at the beginning and the end of the point set. This function contemplates that and doesn't need them.
		 *
		 * https://en.wikipedia.org/wiki/Cubic_Hermite_spline#Catmull%E2%80%93Rom_spline
		 */
		CatmullRom(v, k) {
			const m = v.length - 1;
			let f = m * k;
			let i = Math.floor(f);
			const fn = Interpolation.Utils.CatmullRom;

			if (v[0] == v[m]) {
				if (k < 0) {
					i = Math.floor((f = m * (1 + k)));
				}

				return fn(v[(i - 1 + m) % m], v[i], v[(i + 1) % m], v[(i + 2) % m], f - i);
			}
			if (k < 0) {
				return v[0] - (fn(v[0], v[0], v[1], v[1], -f) - v[0]);
			}

			if (k > 1) {
				return v[m] - (fn(v[m], v[m], v[m - 1], v[m - 1], f - m) - v[m]);
			}

			return fn(v[i ? i - 1 : 0], v[i], v[m < i + 1 ? m : i + 1], v[m < i + 2 ? m : i + 2], f - i);
		},
	},
	/**
	 * Given the spinny nature of angles, sometimes it's better to go back to get to the right place earlier.
	 * This functions help with that.
	 */
	Angle: {
		/**
		 * Normalizes angles between 0 and 2pi and then rotates the object in the shortest direction.
		 */
		Radians(v, k) {
			const m = v.length - 1;
			const f = m * k;
			const i = Math.floor(f);
			const fn = Interpolation.Utils.WrapLinear;

			if (k < 0) {
				return fn(v[0], v[1], f, 2 * Math.PI);
			}

			if (k > 1) {
				return fn(v[m], v[m - 1], m - f, 2 * Math.PI);
			}

			return fn(v[i], v[i + 1 > m ? m : i + 1], f - i, 2 * Math.PI);
		},

		/**
		 * Normalizes angles between 0 and 360 and then rotates the object in the shortest direction.
		 */
		Degrees(v, k) {
			const m = v.length - 1;
			const f = m * k;
			const i = Math.floor(f);
			const fn = Interpolation.Utils.WrapLinear;

			if (k < 0) {
				return fn(v[0], v[1], f, 360);
			}

			if (k > 1) {
				return fn(v[m], v[m - 1], m - f, 360);
			}

			return fn(v[i], v[i + 1 > m ? m : i + 1], f - i, 360);
		},
	},

	/**
	 * Even if colors are numbers, interpolating them can be tricky.
	 */
	Color: {
		/**
		 * Interpolates the color by their channels Red, Green, and Blue.
		 */
		RGB(v, k) {
			const m = v.length - 1;
			const f = m * k;
			const i = Math.floor(f);
			const fn = Interpolation.Utils.RGBLinear;

			if (k < 0) {
				return fn(v[0], v[1], f);
			}

			if (k > 1) {
				return fn(v[m], v[m - 1], m - f);
			}

			return fn(v[i], v[i + 1 > m ? m : i + 1], f - i);
		},

		/**
		 * Interpolates the color by their Hue, Saturation, and Value.
		 */
		HSV(v, k) {
			const m = v.length - 1;
			const f = m * k;
			const i = Math.floor(f);
			const fn = Interpolation.Utils.HSVLinear;

			if (k < 0) {
				return fn(v[0], v[1], f);
			}

			if (k > 1) {
				return fn(v[m], v[m - 1], m - f);
			}

			return fn(v[i], v[i + 1 > m ? m : i + 1], f - i);
		},

		/**
		 * Interpolates the color by their Hue, Chroma, and Lightness.
		 */
		HCL(v, k) {
			const m = v.length - 1;
			const f = m * k;
			const i = Math.floor(f);
			const fn = Interpolation.Utils.HCLLinear;

			if (k < 0) {
				return fn(v[0], v[1], f);
			}

			if (k > 1) {
				return fn(v[m], v[m - 1], m - f);
			}

			return fn(v[i], v[i + 1 > m ? m : i + 1], f - i);
		},
	},

	/**
	 * Helper functions used to calculate the different interpolations
	 */
	Utils: {
		RGBsplit(color) {
			// this gets named ARGB but it is actually meaningless. It will work with RGBA just the same.
			const a = (color >> 24) & 0xff;
			const r = (color >> 16) & 0xff;
			const g = (color >> 8) & 0xff;
			const b = color & 0xff;
			return { a, r, g, b };
		},
		HSVsplit(color) {
			const rgb = Interpolation.Utils.RGBsplit(color);

			(rgb.r /= 255), (rgb.g /= 255), (rgb.b /= 255);

			const max = Math.max(rgb.r, rgb.g, rgb.b);
			const min = Math.min(rgb.r, rgb.g, rgb.b);
			let h;
			const v = max;

			const d = max - min;
			const s = max == 0 ? 0 : d / max;

			if (max == min) {
				h = 0; // achromatic
			} else {
				switch (max) {
					case rgb.r:
						h = (rgb.g - rgb.b) / d + (rgb.g < rgb.b ? 6 : 0);
						break;
					case rgb.g:
						h = (rgb.b - rgb.r) / d + 2;
						break;
					case rgb.b:
						h = (rgb.r - rgb.g) / d + 4;
						break;
				}

				h /= 6;
			}

			return { a: rgb.a, h, s, v };
		},
		HSVJoin(color) {
			let r, g, b;

			const i = Math.floor(color.h * 6);
			const f = color.h * 6 - i;
			const p = color.v * (1 - color.s);
			const q = color.v * (1 - f * color.s);
			const t = color.v * (1 - (1 - f) * color.s);

			switch (i % 6) {
				case 0:
					(r = color.v), (g = t), (b = p);
					break;
				case 1:
					(r = q), (g = color.v), (b = p);
					break;
				case 2:
					(r = p), (g = color.v), (b = t);
					break;
				case 3:
					(r = p), (g = q), (b = color.v);
					break;
				case 4:
					(r = t), (g = p), (b = color.v);
					break;
				case 5:
					(r = color.v), (g = p), (b = q);
					break;
			}
			return (color.a << 24) | (r << 16) | (g << 8) | b;
		},

		HCLSplit(color) {
			/* https://www.chilliant.com/rgb2hsv.html */
			const HCLgamma = 3;
			const HCLy0 = 100;
			const HCLmaxL = 0.530454533953517; // == exp(HCLgamma / HCLy0) - 0.5

			const RGB = Interpolation.Utils.RGBsplit(color);
			const HCL = { a: RGB.a, h: 0, c: 0, l: 0 };
			let H = 0;
			const U = Math.min(RGB.r, Math.min(RGB.g, RGB.b));
			const V = Math.max(RGB.r, Math.max(RGB.g, RGB.b));
			let Q = HCLgamma / HCLy0;
			HCL.c = V - U;
			if (HCL.c != 0) {
				H = Math.atan2(RGB.g - RGB.b, RGB.r - RGB.g) / Math.PI;
				Q *= U / V;
			}
			Q = Math.exp(Q);
			HCL.h = (H / 2 - Math.min(H % 1, -H % 1) / 6) % 1;
			HCL.c *= Q;
			HCL.l = Interpolation.Utils.Linear(-U, V, Q) / (HCLmaxL * 2);
			return HCL;
		},

		HCLJoin(HCL) {
			/* https://www.chilliant.com/rgb2hsv.html */
			const HCLgamma = 3;
			const HCLy0 = 100;
			const HCLmaxL = 0.530454533953517; // == exp(HCLgamma / HCLy0) - 0.5
			const RGB = { a: HCL.a, r: 0, g: 0, b: 0 };

			if (HCL.l != 0) {
				let H = HCL.h;
				const C = HCL.c;
				const L = HCL.l * HCLmaxL;
				const Q = Math.exp((1 - C / (2 * L)) * (HCLgamma / HCLy0));
				const U = (2 * L - C) / (2 * Q - 1);
				const V = C / Q;
				const A = (H + Math.min(((2 * H) % 1) / 4, ((-2 * H) % 1) / 8)) * Math.PI * 2;
				let T;
				H *= 6;
				if (H <= 0.999) {
					T = Math.tan(A);
					RGB.r = 1;
					RGB.g = T / (1 + T);
				} else if (H <= 1.001) {
					RGB.r = 1;
					RGB.g = 1;
				} else if (H <= 2) {
					T = Math.tan(A);
					RGB.r = (1 + T) / T;
					RGB.g = 1;
				} else if (H <= 3) {
					T = Math.tan(A);
					RGB.g = 1;
					RGB.b = 1 + T;
				} else if (H <= 3.999) {
					T = Math.tan(A);
					RGB.g = 1 / (1 + T);
					RGB.b = 1;
				} else if (H <= 4.001) {
					RGB.g = 0;
					RGB.b = 1;
				} else if (H <= 5) {
					T = Math.tan(A);
					RGB.r = -1 / T;
					RGB.b = 1;
				} else {
					T = Math.tan(A);
					RGB.r = 1;
					RGB.b = -T;
				}
				RGB.r = RGB.r * V + U;
				RGB.g = RGB.g * V + U;
				RGB.b = RGB.b * V + U;
			}
			return (RGB.a << 24) | (RGB.r << 16) | (RGB.g << 8) | RGB.b;
		},

		WrapLinear(value1, value2, t, maxValue) {
			let retval;

			// this fixes my values to be between 0 and maxvalue.
			value1 = (value1 + maxValue * Math.trunc(Math.abs(value1 / maxValue))) % maxValue;
			value2 = (value2 + maxValue * Math.trunc(Math.abs(value2 / maxValue))) % maxValue;

			if (Math.abs(value1 - value2) <= 0.5 * maxValue) {
				retval = Interpolation.Utils.Linear(value1, value2, t);
			} else {
				if (value1 < value2) {
					retval = Interpolation.Utils.Linear(value1 + maxValue, value2, t);
				} else {
					retval = Interpolation.Utils.Linear(value1, value2 + maxValue, t);
				}
				retval = retval % maxValue;
			}
			return retval;
		},

		RGBLinear(color1, color2, t) {
			const argb1 = Interpolation.Utils.RGBsplit(color1);
			const argb2 = Interpolation.Utils.RGBsplit(color2);
			const a = Interpolation.Utils.Linear(argb1.a, argb2.a, t);
			const r = Interpolation.Utils.Linear(argb1.r, argb2.r, t);
			const g = Interpolation.Utils.Linear(argb1.g, argb2.g, t);
			const b = Interpolation.Utils.Linear(argb1.b, argb2.b, t);
			return (a << 24) | (r << 16) | (g << 8) | b;
		},
		HSVLinear(color1, color2, t) {
			const ahsv1 = Interpolation.Utils.HSVsplit(color1);
			const ahsv2 = Interpolation.Utils.HSVsplit(color2);
			let h;
			if (Math.abs(ahsv1.h - ahsv2.h) <= 0.5) {
				h = Interpolation.Utils.Linear(ahsv1.h, ahsv2.h, t);
			} else {
				if (ahsv1.h < ahsv2.h) {
					h = Interpolation.Utils.Linear(ahsv1.h + 1, ahsv2.h, t);
				} else {
					h = Interpolation.Utils.Linear(ahsv1.h, ahsv2.h + 1, t);
				}
				h = h % 1;
			}
			const s = Interpolation.Utils.Linear(ahsv1.s, ahsv2.s, t);
			const v = Interpolation.Utils.Linear(ahsv1.v, ahsv2.v, t);
			const a = Interpolation.Utils.Linear(ahsv1.a, ahsv2.a, t); // alpha can't be done with hsv
			return Interpolation.Utils.HSVJoin({ a, h, s, v });
		},
		HCLLinear(color1, color2, t) {
			const ahcl1 = Interpolation.Utils.HCLSplit(color1);
			const ahcl2 = Interpolation.Utils.HCLSplit(color2);
			let h;
			if (Math.abs(ahcl1.h - ahcl2.h) <= 0.5) {
				h = Interpolation.Utils.Linear(ahcl1.h, ahcl2.h, t);
			} else {
				if (ahcl1.h < ahcl2.h) {
					h = Interpolation.Utils.Linear(ahcl1.h + 1, ahcl2.h, t);
				} else {
					h = Interpolation.Utils.Linear(ahcl1.h, ahcl2.h + 1, t);
				}
				h = h % 1;
			}
			const s = Interpolation.Utils.Linear(ahcl1.c, ahcl2.c, t);
			const v = Interpolation.Utils.Linear(ahcl1.l, ahcl2.l, t);
			const a = Interpolation.Utils.Linear(ahcl1.a, ahcl2.a, t); // alpha can't be done with hsv
			return Interpolation.Utils.HSVJoin({ a, h, s, v });
		},

		Linear(p0, p1, t) {
			return (p1 - p0) * t + p0;
		},
		Bernstein(n, i) {
			const fc = Interpolation.Utils.Factorial;

			return fc(n) / fc(i) / fc(n - i);
		},
		Factorial: (function () {
			const a = [1];

			return function (n) {
				let s = 1;

				if (a[n]) {
					return a[n];
				}

				for (let i = n; i > 1; i--) {
					s *= i;
				}

				a[n] = s;

				return s;
			};
		})(),

		CatmullRom(p0, p1, p2, p3, t) {
			const v0 = (p2 - p0) * 0.5;
			const v1 = (p3 - p1) * 0.5;
			const t2 = t * t;
			const t3 = t * t2;

			return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (-3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1;
		},
	},
};

/**
 * ARGB color format
 * Alpha, Red, Green, Blue.
 */

/**
 * Silly class to have a shared number that goes up.
 */
class Sequence {
	 static __initStatic() {this._nextId = 0;}

	 static nextId() {
		return Sequence._nextId++;
	}
} Sequence.__initStatic();

/**
 * Default values used **during tween creation**.
 * Allows to change the default values for all tweens.
 */
const DEFAULTS = {
	safetyCheckFunction: (_) => true,
	easingFunction: Easing.Linear.None,
	yoyoEasingFunction: undefined,
	interpolationFunction: Interpolation.Geom.Linear,
};

/**
 * A Tween is basically an animation command.
 * For example: _Go from here to there in this amount of time._
 *
 * Tweens won't start by themselves. **Remeber to call {@link Tween.start} when you want your tweens to start!**
 *
 * Most methods will return the same object to allow for daisy chaining.
 * @template Target of the tween
 */
class Tween {
	 __init() {this._isPaused = false;}
	 __init2() {this._valuesStart = {};}
	 __init3() {this._valuesEnd = {};}
	 __init4() {this._valuesStartRepeat = {};}
	 __init5() {this._duration = 0;}
	 __init6() {this._repeatCount = 0;}
	 __init7() {this._repeat = 0;}
	
	 __init8() {this._yoyo = false;}
	 __init9() {this._isPlaying = false;}
	 get _reversed() {
		return this.yoyo && this._repeatCount % 2 !== 0;
	}
	 __init10() {this._delayTime = 0;}
	 __init11() {this._startTime = 0;}
	 __init12() {this._elapsedTime = 0;}
	 __init13() {this._timescale = 1;}
	 __init14() {this._safetyCheckFunction = DEFAULTS.safetyCheckFunction;}
	 __init15() {this._easingFunction = DEFAULTS.easingFunction;}
	 __init16() {this._yoyoEasingFunction = DEFAULTS.yoyoEasingFunction;}
	 __init17() {this._interpolationFunction = DEFAULTS.interpolationFunction;}
	 __init18() {this._chainedTweens = [];}
	
	 __init19() {this._onStartCallbackFired = false;}
	
	 __init20() {this._onAfterDelayCallbackFired = false;}
	
	
	
	
	 __init21() {this._id = Sequence.nextId();}
	 __init22() {this._isChainStopped = false;}
	
	
	 get _group() {
		if (this._groupRef) {
			return this._groupRef;
		} else {
			return Group.shared;
		}
	}
	 set _group(value) {
		this._groupRef = value;
	}

	/**
	 * Creates an instance of tween.
	 * @param object - The target object which properties you want to animate
	 * @param group - The {@link Group} this new Tween will belong to. If none is provided it will default to the static {@link Group.shared}
	 */
	constructor(object, group) {Tween.prototype.__init.call(this);Tween.prototype.__init2.call(this);Tween.prototype.__init3.call(this);Tween.prototype.__init4.call(this);Tween.prototype.__init5.call(this);Tween.prototype.__init6.call(this);Tween.prototype.__init7.call(this);Tween.prototype.__init8.call(this);Tween.prototype.__init9.call(this);Tween.prototype.__init10.call(this);Tween.prototype.__init11.call(this);Tween.prototype.__init12.call(this);Tween.prototype.__init13.call(this);Tween.prototype.__init14.call(this);Tween.prototype.__init15.call(this);Tween.prototype.__init16.call(this);Tween.prototype.__init17.call(this);Tween.prototype.__init18.call(this);Tween.prototype.__init19.call(this);Tween.prototype.__init20.call(this);Tween.prototype.__init21.call(this);Tween.prototype.__init22.call(this);
		this._object = object;
		this._group = group;
	}

	/**
	 * Gets the id for this tween. A tween id is a number that increases perpetually with each tween created. It is used inside {@link Group} to keep track of tweens
	 * @returns returns the id for this tween.
	 */
	 getId() {
		return this._id;
	}

	/**
	 * Gets {@link Group} that this tween belongs to.
	 * @returns returns the {@link Group} for this tween.
	 */
	 getGroup() {
		return this._group;
	}

	/**
	 * Gets the timescale for this tween. The timescale is a factor by which each deltatime is multiplied, allowing to speed up or slow down the tween.
	 * @returns returns the timescale for this tween.
	 */
	 getTimescale() {
		return this._timescale;
	}

	/**
	 * A tween is playing when it has been started but hasn't ended yet. This has nothing to do with pausing. For that see {@link Tween.isPaused}.
	 * @returns returns true if this tween is playing.
	 */
	 isPlaying() {
		return this._isPlaying;
	}

	/**
	 * A tween can only be paused if it was playing.
	 * @returns returns true if this tween is paused.
	 */
	 isPaused() {
		return this._isPaused;
	}

	/**
	 * Writes the starting values of the tween.
	 *
	 * **Starting values generated from {@link Tween.start} will be overwritten.**
	 * @param properties - Starting values for this tween.
	 * @returns returns this tween for daisy chaining methods.
	 */
	

	 from(properties) {
		try {
			JSON.stringify(properties);
		} catch (e) {
			throw new Error("The object you provided to the from() method has a circular reference!");
		}
		this._setupProperties(properties, this._valuesStart, properties, this._valuesStartRepeat, true);
		return this;
	}

	/**
	 * Set the final values for the target object's properties by copy.
	 * This will try to create a deep copy of the `properties` parameter.
	 * If you want the tween to keep a reference to the final values use {@link Tween.dynamicTo}.
	 *
	 * If an array value is provided for a value that originally wasn't an array, it will be interpreted as an interpolable curve and the values inside the array will be interpolated using the function provided in {@link Tween.interpolation}
	 *
	 * If a string value that starts with either `+` or `-`is provided it will be taken as a _relative value_ to the start value.
	 * @param properties - final values for the target object.
	 * @param duration - if given it will be used as the duration in **miliseconds**. if not, a call to {@link Tween.duration} will be needed.
	 * @returns returns this tween for daisy chaining methods.
	 */
	

	 to(properties, duration) {
		try {
			this._valuesEnd = JSON.parse(JSON.stringify(properties));
		} catch (e) {
			// recursive object. this gonna crash!
			console.warn("The object you provided to the to() method has a circular reference!. It can't be cloned. Falling back to dynamic targeting");
			return this.dynamicTo(properties, duration);
		}

		if (duration !== undefined) {
			this._duration = duration;
		}

		return this;
	}

	/**
	 * Set the final values for the target object's properties by reference.
	 * This will store a reference to the properties object allowing you to change the final values while the tween is running.
	 * If you want the tween to make a copy of the final values use {@link Tween.to}.
	 * @param properties - final values for the target object.
	 * @param duration - if given it will be used as the duration in **miliseconds**. if not, a call to {@link Tween.duration} will be needed.
	 * @returns returns this tween for daisy chaining methods.
	 */
	

	 dynamicTo(properties, duration) {
		this._valuesEnd = properties; // JSON.parse(JSON.stringify(properties));

		if (duration !== undefined) {
			this._duration = duration;
		}

		return this;
	}

	/**
	 * Sets the duration for this tween in **miliseconds**.
	 * @param d - The duration for this tween in **miliseconds**.
	 * @returns returns this tween for daisy chaining methods.
	 */
	 duration(d) {
		this._duration = d;

		return this;
	}

	/**
	 * Tweens won't start by themselves when created. Call this to start the tween.
	 * Starting values for the animation will be stored at this moment.
	 *
	 * **This function can't overwrite the starting values set by {@link Tween.from}**
	 *
	 * You can call this method on a finished tween to restart it without changing the starting values.
	 * To restart a tween and reset the starting values use {@link Tween.restart}
	 * @param delay - if given it will be used as the delay in **miliseconds**.
	 * @returns returns this tween for daisy chaining methods.
	 */
	 start(delay) {
		if (this._isPlaying) {
			return this;
		}

		if (delay != undefined) {
			this._delayTime = delay;
		}

		this._group.add(this);

		if (this._reversed) {
			this._swapEndStartRepeatValues(this._valuesStartRepeat, this._valuesEnd);
			this._valuesStart = JSON.parse(JSON.stringify(this._valuesStartRepeat));
		}

		this._repeatCount = 0; // This must be after we check for the _reversed flag!!.

		this._isPlaying = true;

		this._isPaused = false;

		this._onStartCallbackFired = false;

		this._onAfterDelayCallbackFired = false;

		this._isChainStopped = false;

		this._startTime = -this._delayTime;

		this._elapsedTime = 0;

		this._setupProperties(this._object, this._valuesStart, this._valuesEnd, this._valuesStartRepeat, false);

		return this;
	}

	/**
	 * @experimental
	 * Forces a tween to restart.
	 * Starting values for the animation will be stored at this moment.
	 * This literally calls {@link Tween.reset} and then {@link Tween.start}.
	 *
	 * **Starting values will be cleared!. This function will erase all values created from {@link Tween.from} and/or {@link Tween.start}**
	 * @param delay - if given it will be used as the delay in **miliseconds**.
	 * @returns returns this tween for daisy chaining methods.
	 */
	 restart(delay) {
		this.reset();
		return this.start(delay);
	}

	/**
	 * @experimental
	 * Clears the starting and loop starting values.
	 *
	 * **Starting values will be cleared!. This function will erase all values created from {@link Tween.from} and/or {@link Tween.start}**
	 * @returns returns this tween for daisy chaining methods.
	 */
	 reset() {
		if (this._isPlaying) {
			this.stop();
		}
		this._valuesStart = {};
		this._valuesStartRepeat = {};
		return this;
	}

	/**
	 * @experimental
	 * Stops the tween and sets the values to the starting ones.
	 *
	 * @returns returns this tween for daisy chaining methods.
	 */
	 rewind() {
		if (this._isPlaying) {
			this.stop();
		}

		if (this._reversed) {
			// if you rewind from a reversed position, we unreverse.
			this._swapEndStartRepeatValues(this._valuesStartRepeat, this._valuesEnd);
		}

		const value = this._easingFunction(0);

		// properties transformations
		this._updateProperties(this._object, this._valuesStart, this._valuesEnd, value);

		return this;
	}

	 _setupProperties(_object, _valuesStart, _valuesEnd, _valuesStartRepeat, overwrite) {
		for (const property in _valuesEnd) {
			const startValue = _object[property];
			const startValueIsArray = Array.isArray(startValue);
			const startValueIsNumber = !Number.isNaN(Number(startValue));
			const propType = startValueIsArray ? "array" : typeof startValue;
			const startValueIsObject = propType == "object";
			const endValueIsObject = typeof _valuesEnd[property] == "object";
			const isInterpolationList = !startValueIsArray && Array.isArray(_valuesEnd[property]);

			// If to() specifies a property that doesn't exist in the source object,
			// we should not set that property in the object
			if (propType == "undefined" || propType == "function" || _valuesEnd[property] == undefined || (!startValueIsArray && !startValueIsNumber && !startValueIsObject)) {
				continue;
			}

			// handle the deepness of the values
			if ((startValueIsObject || startValueIsArray || endValueIsObject) && startValue && !isInterpolationList) {
				if (typeof _valuesStart[property] == "undefined") {
					_valuesStart[property] = startValueIsArray ? [] : {};
				}
				if (typeof _valuesStartRepeat[property] == "undefined") {
					_valuesStartRepeat[property] = startValueIsArray ? [] : {};
				}

				this._setupProperties(startValue, _valuesStart[property], _valuesEnd[property], _valuesStartRepeat[property], overwrite);
			} else {
				// Save the starting value, but only once.
				if (typeof _valuesStart[property] == "undefined" || overwrite) {
					_valuesStart[property] = startValue;
				}

				if (typeof _valuesStartRepeat[property] == "undefined" || overwrite) {
					if (isInterpolationList) {
						_valuesStartRepeat[property] = _valuesEnd[property].slice().reverse()[0];
					} else {
						_valuesStartRepeat[property] = _valuesStart[property] || 0;
					}
				}
			}
		}
	}

	/**
	 * Stops this tween
	 * @returns returns this tween for daisy chaining methods.
	 */
	 stop() {
		if (!this._isChainStopped) {
			this._isChainStopped = true;
			this.stopChainedTweens();
		}

		if (!this._isPlaying) {
			return this;
		}

		this._group.remove(this);

		this._isPlaying = false;

		this._isPaused = false;

		if (this._onStopCallback) {
			this._onStopCallback(this._object, this);
		}

		return this;
	}

	/**
	 * Fastforwards this tween to the end by triggering an update with an infinite value.
	 * This will work even on paused tweens.
	 * @returns returns this tween for daisy chaining methods.
	 */
	 end(endChainedTweens = false) {
		let protectedChainedTweens = [];

		if (!endChainedTweens) {
			protectedChainedTweens = this._chainedTweens;
			this._chainedTweens = [];
		}

		this.resume();
		this.update(Infinity);

		if (!endChainedTweens) {
			this._chainedTweens = protectedChainedTweens;
			for (let i = 0, numChainedTweens = this._chainedTweens.length; i < numChainedTweens; i++) {
				this._chainedTweens[i].start();
			}
		}

		return this;
	}

	/**
	 * @experimental
	 * Skips forward the in the repeats of this tween by triggering a biiiiig update.
	 * Think of this as a less agressive {@link Tween.end}.
	 *
	 * @param amount - The amount of repeats to skip.
	 * @param resetCurrentLoop - If true, the time will become zero and the object will return to the initial value in the next update.
	 * @returns returns this tween for daisy chaining methods.
	 */
	 skip(amount, resetCurrentLoop = false) {
		this.resume();

		this.update(amount * this._duration - (resetCurrentLoop ? this._elapsedTime : 0));

		return this;
	}

	/**
	 * Pauses this tween. Does nothing is if the tween was already paused or wasn't playing.
	 * Paused tweens ignore all update calls.
	 * @returns returns this tween for daisy chaining methods.
	 */
	 pause() {
		if (this._isPaused || !this._isPlaying) {
			return this;
		}

		this._isPaused = true;

		this._group.remove(this);

		return this;
	}

	/**
	 * Resumes this tween. Does nothing if the tween wasn't paused nor running.
	 * @returns returns this tween for daisy chaining methods.
	 */
	 resume() {
		if (!this._isPaused || !this._isPlaying) {
			return this;
		}

		this._isPaused = false;

		this._group.add(this);

		return this;
	}

	/**
	 * @experimental
	 * Stops tweens chained to this tween. To chain a tween see {@link Tween.chain}.
	 *
	 * @returns returns this tween for daisy chaining methods.
	 */
	 stopChainedTweens() {
		for (let i = 0, numChainedTweens = this._chainedTweens.length; i < numChainedTweens; i++) {
			this._chainedTweens[i].stop();
		}

		return this;
	}

	/**
	 * @experimental
	 * Starts all tweens chained to this tween. To chain a tween see {@link Tween.chain}.
	 *
	 * @param stopThis - If true, this tween will be stopped before it starts the chained tweens.
	 * @returns returns this tween for daisy chaining methods.
	 */
	 startChainedTweens(stopThis = false) {
		if (stopThis) {
			this.stop();
		}

		for (let i = 0, numChainedTweens = this._chainedTweens.length; i < numChainedTweens; i++) {
			this._chainedTweens[i].start();
		}

		return this;
	}

	/**
	 * Sets the {@link Group} for this tween.
	 * @param group - the group for this tween. If undefined or null is given, the group will default to {@link Group.shared}.
	 * @returns returns this tween for daisy chaining methods.
	 */
	 group(group) {
		this._group = group;

		return this;
	}

	/**
	 * Sets the delay for this tween.
	 *
	 * This will only be applied at the start of the tween. For delaying the repeating of a tween, see {@link Tween.repeatDelay}
	 *
	 * **This will only work before calling {@link Tween.start}.**
	 * @param amount - the delay for this tween.
	 * @returns returns this tween for daisy chaining methods.
	 */
	 delay(amount) {
		this._delayTime = amount;

		return this;
	}

	/**
	 * Sets the timescale for this tween.
	 * The deltaTime inside the update will be multiplied by this value allowing to speed up or slow down the flow of time.
	 * @param multiplier - the timescale value for this tween.
	 * @returns returns this tween for daisy chaining methods.
	 */
	 timescale(multiplier) {
		this._timescale = multiplier;

		return this;
	}

	/**
	 * Sets the number of times this tween will loop
	 * @param times - the number of loops. For endless loops use `Infinity`
	 * @returns returns this tween for daisy chaining methods.
	 */
	 repeat(times = Infinity) {
		this._repeat = times;

		return this;
	}

	/**
	 * Sets the repeat delay for this tween.
	 *
	 * This will only be applied at the start of every repeat. For delaying only the start, see {@link Tween.delay}
	 * @param amount - the repeat delay for this tween.
	 * @returns returns this tween for daisy chaining methods.
	 */
	 repeatDelay(amount) {
		this._repeatDelayTime = amount;

		return this;
	}

	/**
	 * Sets if this tween should yoyo (reflect) itself when repeating.
	 * @param yoyo - the yoyo value for this tween.
	 * @returns returns this tween for daisy chaining methods.
	 */
	 yoyo(yoyo = true) {
		this._yoyo = yoyo;

		return this;
	}

	/**
	 * Sets the easing function to interpolate the starting values with the final values.
	 *
	 * You can use the functions inside the {@link Easing} object.
	 * @param easingFunction - a function that takes a number between 0 and 1 and returns another number between 0 and 1
	 * @returns returns this tween for daisy chaining methods.
	 */
	 easing(easingFunction) {
		this._easingFunction = easingFunction;

		return this;
	}

	/**
	 * @experimental
	 * Sets the safety check function to test if the tweening object is still valid.
	 * If the function returns a non-truthy value, the tween will skip the update loop.
	 * @param safetyCheckFunction - a function that takes the target object for this tween and returns true if the object is still valid.
	 * @returns returns this tween for daisy chaining methods.
	 */
	 safetyCheck(safetyCheckFunction) {
		this._safetyCheckFunction = safetyCheckFunction;

		return this;
	}

	/**
	 * @experimental
	 * Sets the easing function to interpolate the starting values with the final values on the way back due to a yoyo tween.
	 *
	 * You can use the functions inside the {@link Easing} object.
	 * @param easingFunction - a function that takes a number between 0 and 1 and returns another number between 0 and 1
	 * @returns returns this tween for daisy chaining methods.
	 */
	 yoyoEasing(easingFunction) {
		this._yoyoEasingFunction = easingFunction;

		return this;
	}

	/**
	 * Sets the easing function to interpolate the starting values with the final values when the final value is an array of objects.
	 * Use this to create bezier curves or interpolate colors.
	 *
	 * You can use the functions inside the {@link Interpolation} object.
	 * @param interpolationFunction
	 * @returns returns this tween for daisy chaining methods.
	 */
	 interpolation(interpolationFunction) {
		this._interpolationFunction = interpolationFunction;

		return this;
	}

	/**
	 * Adds tweens to be called when this tween ends.
	 * The tweens here will be called all at the same time.
	 * @param tweens - tweens to be started when this tween ends
	 * @returns returns this tween for daisy chaining methods.
	 */
	 chain(...tweens) {
		this._chainedTweens = tweens;

		return this;
	}

	/**
	 * Sets the onStart callback. This will be called as soon as you call {@link Tween.start}.
	 * @param callback - the function to call on start. It will recieve the target object and this tween as a parameter.
	 * @returns returns this tween for daisy chaining methods.
	 */
	 onStart(callback) {
		this._onStartCallback = callback;

		return this;
	}

	/**
	 * Sets the onAfterDelay callback. This will be called when the delay is over.
	 * @param callback - the function to call on start. It will recieve the target object and this tween as a parameter.
	 * @returns returns this tween for daisy chaining methods.
	 */
	 onAfterDelay(callback) {
		this._onAfterDelayCallback = callback;

		return this;
	}

	/**
	 * Sets the onStart callback
	 * @param callback - the function to call on start. It will recieve the target object, this tween, and a number between 0 and 1 determining the progress as a parameter.
	 * @returns returns this tween for daisy chaining methods.
	 */
	 onUpdate(callback) {
		this._onUpdateCallback = callback;

		return this;
	}

	/**
	 * Sets the onRepeat callback
	 * @param callback - the function to call on repeat. It will recieve the target object and this tween as a parameter.
	 * @returns returns this tween for daisy chaining methods.
	 */
	 onRepeat(callback) {
		this._onRepeatCallback = callback;

		return this;
	}

	/**
	 * Sets the onComplete callback
	 * @param callback - the function to call on complete. It will recieve the target object and this tween as a parameter.
	 * @returns returns this tween for daisy chaining methods.
	 */
	 onComplete(callback) {
		this._onCompleteCallback = callback;

		return this;
	}

	/**
	 * Sets the onStop callback
	 * @param callback - the function to call on stop. It will recieve the target object and this tween as a parameter.
	 * @returns returns this tween for daisy chaining methods.
	 */
	 onStop(callback) {
		this._onStopCallback = callback;

		return this;
	}

	/**
	 * Updates this tween
	 * @param deltaTime - the amount of time that passed since last update in **miliseconds**
	 * @param preserve - Prevent the removal of stopped, paused, finished or non started tweens from their group.
	 * @returns returns true if the tween hasn't finished yet.
	 */
	 update(deltaTime, preserve = false) {
		const retval = this._internalUpdate(deltaTime);
		if (!retval && !preserve) {
			this._group.remove(this);
		}
		return retval;
	}

	 _internalUpdate(deltaTime) {
		if (!this._safetyCheckFunction(this._object)) {
			return false;
		}

		if (this._isPaused) {
			return false;
		}

		deltaTime *= this._timescale;

		let elapsed;

		this._elapsedTime += deltaTime;

		const endTime = this._duration;
		const currentTime = this._startTime + this._elapsedTime;

		if (currentTime > endTime && !this._isPlaying) {
			return false;
		}

		// If the tween was already finished,
		if (!this.isPlaying) {
			this.start();
		}

		if (this._onStartCallbackFired == false) {
			if (this._onStartCallback) {
				this._onStartCallback(this._object, this);
			}

			this._onStartCallbackFired = true;
		}

		if (this._onAfterDelayCallbackFired == false && currentTime >= 0) {
			if (this._onAfterDelayCallback) {
				this._onAfterDelayCallback(this._object, this);
			}

			this._onAfterDelayCallbackFired = true;
		}

		elapsed = currentTime / this._duration;
		// zero duration makes elapsed a NaN. We need to fix this!
		if (this._duration == 0) {
			// positive currentTime means we have no delay to wait for!
			if (currentTime >= 0) {
				elapsed = 1;
			} else {
				elapsed = 0;
			}
		}
		// otherwise, clamp the result
		elapsed = Math.min(1, elapsed);
		elapsed = Math.max(0, elapsed);

		let leftOverTime = Number.isFinite(currentTime) ? currentTime % this._duration : currentTime; // leftover time
		if (Number.isNaN(leftOverTime)) {
			leftOverTime = 0;
		}
		const loopsMade = Math.floor(currentTime / this._duration); // if we overloop, how many loops did we eat?

		// check which easing to use...
		let value;
		if (this._reversed && this._yoyoEasingFunction) {
			value = this._yoyoEasingFunction(elapsed);
		} else {
			value = this._easingFunction(elapsed);
		}

		// properties transformations
		this._updateProperties(this._object, this._valuesStart, this._valuesEnd, value);

		// if there is absolutely no chance to loop, call update. we will be done.
		if (this._onUpdateCallback && (elapsed != 1 || this._repeat - this._repeatCount <= 0)) {
			this._onUpdateCallback(this._object, elapsed, this);
		}

		if (elapsed == 1) {
			if (this._repeat - this._repeatCount > 0) {
				// increase loops
				const oldCount = this._repeatCount;
				this._repeatCount = Math.min(this._repeat + 1, this._repeatCount + loopsMade);

				if (this._onUpdateCallback && (this._repeat - this._repeatCount < 0 || leftOverTime <= 0)) {
					this._onUpdateCallback(this._object, elapsed, this);
				}

				// fix starting values for yoyo or relative
				if (this._yoyo) {
					this._swapEndStartRepeatValues(this._valuesStartRepeat, this._valuesEnd);
				} else {
					this._moveForwardStartRepeatValues(this._valuesStartRepeat, this._valuesEnd);
				}

				// Reassign starting values
				this._valuesStart = JSON.parse(JSON.stringify(this._valuesStartRepeat));

				// restart start time
				if (this._repeatDelayTime !== undefined) {
					this._startTime = -this._repeatDelayTime;
				} else {
					this._startTime = 0;
				}

				if (this._onRepeatCallback) {
					// We fallback to only one call.
					let callbackCount = 1;

					if (Number.isFinite(loopsMade)) {
						// if we have a logical number of loops, we trigger the callback that many times
						callbackCount = this._repeatCount - oldCount;
					} else if (Number.isFinite(this._repeat)) {
						// if the amount of loops is infinite, we trigger the callback the amount of loops remaining
						callbackCount = this._repeat - oldCount;
					}

					for (let i = 0; i < callbackCount; i++) {
						this._onRepeatCallback(this._object, oldCount + 1 + i, this);
					}
				}

				this._elapsedTime = 0; // reset the elapsed time

				// if we have more loops to go, then go
				if (this._repeat - this._repeatCount >= 0) {
					// update with the leftover time
					if (leftOverTime > 0 && Number.isFinite(this._repeat)) {
						// only if it is greater than 0 and do not emit onupdate events...
						this._internalUpdate(leftOverTime);
					}
					return true;
				}
			}

			// If we are here, either we are not a looping boi or we are a finished looping boi
			if (this._onCompleteCallback) {
				this._onCompleteCallback(this._object, this);
			}

			for (let i = 0, numChainedTweens = this._chainedTweens.length; i < numChainedTweens; i++) {
				// Make the chained tweens start exactly at the time they should,
				// even if the update method was called way past the duration of the tween
				this._chainedTweens[i].start();
				if (leftOverTime > 0) {
					this._chainedTweens[i].update(leftOverTime);
				}
			}

			this._isPlaying = false;

			return false;
		}

		return true;
	}

	 _updateProperties(_object, _valuesStart, _valuesEnd, value) {
		for (const property in _valuesEnd) {
			// Don't update properties that do not exist in the source object
			if (_valuesStart[property] == undefined) {
				continue;
			}

			const start = _valuesStart[property];
			let end = _valuesEnd[property];
			const startIsArray = Array.isArray(_object[property]);
			const endIsArray = Array.isArray(end);
			const isInterpolationList = !startIsArray && endIsArray;

			if (isInterpolationList) {
				if (this._reversed) {
					_object[property] = this._interpolationFunction(end.concat([start]) , value);
				} else {
					_object[property] = this._interpolationFunction([start].concat(end) , value);
				}
			} else if (typeof end == "object" && end) {
				this._updateProperties(_object[property], start, end, value);
			} else {
				// Parses relative end values with start as base (e.g.: +10, -3)
				end = this._handleRelativeValue(start , end );

				// Protect against non numeric properties.
				if (typeof end == "number" && (typeof start == "number" || typeof start == "string")) {
					// I am certain that start here won't anser NaN or it would have been filtrated on the setupProperties
					_object[property] = Number(start) + (end - Number(start)) * value;

					// if it was originally a string, we make it back to string. keep it tidy
					if (typeof start == "string") {
						_object[property] = String(_object[property]);
					}
				}
			}
		}
	}

	 _handleRelativeValue(start, end) {
		if (typeof end !== "string") {
			return end;
		}

		if (end.charAt(0) == "+" || end.charAt(0) == "-") {
			return start + Number(end);
		}

		return Number(end);
	}

	 _swapEndStartRepeatValues(_valuesStartRepeat, _valuesEnd) {
		for (const property in _valuesStartRepeat) {
			const isInterpolationList = !Array.isArray(_valuesStartRepeat[property]) && Array.isArray(_valuesEnd[property]);

			if (typeof _valuesStartRepeat[property] == "object") {
				this._swapEndStartRepeatValues(_valuesStartRepeat[property], _valuesEnd[property]);
			} else {
				const tmp = _valuesStartRepeat[property];
				if (typeof _valuesEnd[property] == "string") {
					_valuesStartRepeat[property] = Number(_valuesStartRepeat[property]) + Number(_valuesEnd[property]);
					_valuesEnd[property] = tmp;
				} else if (isInterpolationList) {
					const aux = _valuesEnd[property].slice().reverse();
					_valuesStartRepeat[property] = aux[0];
					_valuesEnd[property] = aux;
				} else {
					_valuesStartRepeat[property] = _valuesEnd[property];
					_valuesEnd[property] = tmp;
				}
			}
		}
	}

	 _moveForwardStartRepeatValues(_valuesStartRepeat, _valuesEnd) {
		for (const property in _valuesStartRepeat) {
			if (typeof _valuesEnd[property] == "object") {
				this._moveForwardStartRepeatValues(_valuesStartRepeat[property], _valuesEnd[property]);
			} else {
				if (typeof _valuesEnd[property] == "string") {
					_valuesStartRepeat[property] = Number(_valuesStartRepeat[property]) + Number(_valuesEnd[property]);
				}
			}
		}
	}
}

/**
 * Constant with the hardcoded version of the app
 */
const VERSION = "2.1.0";

exports.DEFAULTS = DEFAULTS;
exports.Easing = Easing;
exports.Group = Group;
exports.Interpolation = Interpolation;
exports.Tween = Tween;
exports.VERSION = VERSION;
//# sourceMappingURL=tweedle.js.map
