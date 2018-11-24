import * as a1lib from "@alt1/base";
import { ImgRef } from "@alt1/base";

var imgs = a1lib.ImageDetect.webpackImages({
	dren: a1lib.ImageDetect.imageDataFromBase64("iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAIAAACQKrqGAAABvklEQVQoU2P4BwZHDyx6sVbo70dpEPqtCET//kDRm5cKFjpi+soiDB8+fXvx4hVCNao6CPr1XdFaX4IhLTkaqPr2vcdA1SdPHb8wi/fzB8Wvn5A0/NMBovfvtBlerBECqgYaDDF7x/HzUiK8XpYqnhZKD+8ilAIRw+/30ndnCiKrXrb/lLQoH1A1ED26r41Q+uudNBCdn8kbHB519ep1IHr/79/iFauhZlshmfrrhRAQvbysCJRz8/KFq549exZE9aMHUIMZfj4XAqIX10SAokB7kVVPmDQZ7hIgYvjxTBiIvj4WdrfU8LTSkhLhh6gGhgkwZGprqix1pNwtNIw0ZBm+PxUGom9PhA+tFgEqBakWFTC1cwYGHMSj5voS9vqCs2bNZAAq+gpEj4U/PxLeO18GaABQtbSogLqOHtBzQKXbt20DIqAlDJcOSXx5BFL36YHIx/siL87zXtwpeGar0O5uIStNVmCwAIMPCPRNzBgcTTUenBf7/BCk7t1VnteXeF5e4H1ymu/6foGZGYJAtwLN61i83ikskcHWUNnZXOPUZqH313jeXoEqfXyK7/ZcQWB4AR0A9GVGTev/g/MAJf9QJ/TaG/QAAAAASUVORK5CYII="),
	drenretal: a1lib.ImageDetect.imageDataFromBase64("iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAIAAACQKrqGAAABt0lEQVQoU12QXSiDURzGz40r72vzzkfawjsXtGRkpCUtJCk3FNqSSUncK5pLH6UkrrbViJRCyyxEyUcS8t0Si0jxTs3ms9i8PNtpS05PnXOe53f+538OEcNje33CM8eJL3IxwIcUjMipQEQZ4n/5EITH/3SY8zh4ygEARlpbDJjc13ewdvd2Tizs5xv/9c5fjmViCxMRAGBEmOUw4RytvbxzpM1iICxoPaino/x7U02Cfvm1Of4vbVtYbTP1RjlE6EQUs0nQJ4eOzWxtvd7lOod8YXp4ZBTrkDmfBC6EBjxcwCd/vlVoMpiKquoobbVa1JpCmN57VQQVOMjvTtCqZKjxtzYK5yvZIaMSGmzkSXA75UvgPp1cj6l7aXERndHa9OEwm3SJffp0oy6ZOKa60GinIQ0ZfgeVcG9BSRnW9Fna3OSaItZqMRMQKAbBnZyeAafLS1WnsZnZOdjCpCkwggz/goEuGyrZB6viak1ysSLZGpIWq2Jg0hQYKa1rHpi04xDa2u+X+F2xT2fM4yFzsxU31i6FiQgAMPKzYcOH4zTuQt+vdpn3lPEcMLfjUvwXTLwSwM+G7Rcch3I6uBMHYwAAAABJRU5ErkJggg=="),
	lifepoints: a1lib.ImageDetect.imageDataFromBase64("iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAIAAACQKrqGAAAAyElEQVQoU5WPsQrCMBCGb9QM1aSCLQkFbYe66CQV3DqKm3T2EXwAd5/atv5JNI1VC8IHd7n/y5FQfSsczXVb5eE8CECVz3D0U9Lny9qCHuRqdIyZ7f2ImvPKR0/fG4dW21MG/KmPSwmlPiyAHX3i0k4dplPbUg3wv4r3PtVd/B2j6m/dzQ1t94wXdiU0ChlD+bnYrIQAjTIhUBr7oJ5nViKCAI02UZRyLifa7i8uFYZyylIhoNE+SVCWnGfBWKvONj2GiCAUUj4AdW38eKRgDyoAAAAASUVORK5CYII="),
	lifepointspoison: a1lib.ImageDetect.imageDataFromBase64("iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAIAAACQKrqGAAAAyUlEQVQoU2P4948Dju7/44gqZPKLZfCMZAAygFxkWYb3/7mREVDa0ZfFJ4YZTRyIGIByaGj/N1YgQhMEIobzf9mJRAwQM4hBIKWbXhBGIKUQ1qIbLHgQRA1IKZoEVoRQ2neBGQ+CKi3bCeV37mLFiiCyQGUMqvqMGZuZ4Hw0BBEHKgAqY7DxY1DQAKmGyAEZcAQXUdRkBCpjcAphsPFlUDZgCFuJUARHQEGgFFABUBmDjTeDXSCDhQeDgg66aiBXUQckBVRg480AAAloFb/8BmXmAAAAAElFTkSuQmCC"),
	prayer: a1lib.ImageDetect.imageDataFromBase64("iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAIAAACQKrqGAAABO0lEQVQoU5WSwUrDQBRF358U0WK1JpimyUiapKGGEGNsbCpIRaWgCwUVWroQ1LX5hK7ThZ9hu3LhB7hz485Nv8DUWx4URaX4eAyXew/JvJmh8PBEK4WO3vbNi9Du6lLcH76+ZBOsQm7uVHvwkYIh5gK7E7u3W2bH9trP44+3bILVqbUCqwsfKRiacbF7pxbrD0/v4yzjhi4Xo8bmDdPkGedQdedayHtJOgIxK2g48JGCId+68iuX68tBMvjGcU3pwQgpGFJWtr3GGf/314KPFAxhUkzwF8eFFAzhXDDvXBTMf766lq+50encvYIhWzs2lP3Cgpmkw580HPhIwZClHuAW7PLR6mL1Pn38SkPDgY90eltCjpmulFpLOcE74YbO5wR8pGBIVTym0ZoUCaeJCfgNbBiBLu1yJOT4E5+5hG6GjZJoAAAAAElFTkSuQmCC"),
	prayeron: a1lib.ImageDetect.imageDataFromBase64("iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAIAAACQKrqGAAABVElEQVQoU42Sz0vCYBjHn3+oILqUp7YRk2koZM6YplugFkuJ3aIEb/kDbRJMIQZlVER06OipjLKM6FbdErvVwb+g2ZdeiOgH9vDy8uz7+bzbnjFShUaYX19TjkrxRkW/THjLtbPOg9PHvuSrbKaukYPCIeYVE+0t47G80JaDmZve27PTx65Mr5iLt8hB4ZAxe4Kuuty10k+quHHQeu05DlvoI5MmclA4lI1elVIdU+/GPXZh9wLGZ6FHghwUDmVj91n1LsSZ3zxWzAaFQ0HOkpU8e+6vhRw0FC4QJsUEf3msQOEQvgvmHajCoerpv+8qjWd88urAd4VDSf/xnHt7YkTP1c9/2kiQg8IhbWon7j+c9+7xo+lcvfnV/vCayEHhUJA3Yx4bB6KS7RpS91svMNhC7xrWFLcFCofEMSPA5yNSDRdoODGJCdg/IAjaDF9EDhrg8+8a5LF4AbL/qAAAAABJRU5ErkJggg=="),
	sumpoints: a1lib.ImageDetect.imageDataFromBase64("iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAIAAACQKrqGAAABrElEQVQoUz2RSyhEYRSAfzsLZuGxMd1pPK7HPIx5XGkw8hpNNjPFbGZDbMRClIUNokjESsRI1CSLkdjJI1KTlTJlN6ZmQ5KdBZnx3X65nU7nP+c7zyvqvO0lRtP04aWnO9g/Obed/oomX09Sn4mfXHt40NbmbwkEXV29lpZOUe3xmirVjvBgYGgclJzRtT308XsW2un1me2u6sZWG6hqd8Jpvs7hmXVJmKtqhMjDSQee0ceXkdWoxx8SuGh9mHjbukkvn91N7cQhKIyNMX+TQjDoIOBiV/dYhBkgsrABRHlEQlL+0KWDY7Rca+Xi8T8siads7iOrfzqKyHHhMtmcDCMYEBJF9FkphkbkjUiAIAZE5vX7N2v0DIwJ9gClMBfAuxy71XeK3TIxTxIW9+PFRlOlu0nIDShJDrTcDJozFxYZjh6elRqrqjXrv4Di/B7CQAgQOST3TcyWKOWKxWF2aFWeZkQwXzyZoR0cBJnMihNdVEZfr+TKGzSxe3oeHh5jLMkBSY3H5tYUqwOoot6tWF3CF4rkFxgSqVdikpAop5jcPCo1q0DGWnuZavkFWahGSVugAUYAAAAASUVORK5CYII=")
});

export function shakemepls() {
	console.log("I'm not shaken");
}

/*
function makelayout(){
	var img=a1lib.bindfullrs();
	var qq={ hp: a1lib.findsubimg(img, ActionbarReader.lifepoints)[0], dren: a1lib.findsubimg(img, ActionbarReader.dren)[0], pray: a1lib.findsubimg(img, ActionbarReader.prayer)[0], sum: a1lib.findsubimg(img, ActionbarReader.sumpoints)[0]}
	var qqq={hp:{x:qq.hp.x-qq.hp.x,y:qq.hp.y-qq.hp.y},dren:{x:qq.dren.x-qq.hp.x,y:qq.dren.y-qq.hp.y},pray:{x:qq.pray.x-qq.hp.x,y:qq.pray.y-qq.hp.y},sum:{x:qq.sum.x-qq.hp.x,y:qq.sum.y-qq.hp.y}}
	return jsonEncode(qqq);
}*/

export default class ActionbarReader {
	pos = null;

	static layouts = [
		{ "hp": { "x": 0, "y": 0 }, "dren": { "x": 118, "y": 0 }, "pray": { "x": 236, "y": 0 }, "sum": { "x": 354, "y": 0 }, width: 550, height: 25, hor: true, barlength: 80, type: "mainflat" },
		{ "hp": { "x": 0, "y": 0 }, "dren": { "x": 100, "y": 0 }, "pray": { "x": 16, "y": 22 }, "sum": { "x": 116, "y": 22 }, width: 300, height: 45, hor: true, barlength: 62, type: "mainhor" },
		{ "hp": { "x": 0, "y": 0 }, "dren": { "x": 0, "y": 100 }, "pray": { "x": 22, "y": 16 }, "sum": { "x": 22, "y": 116 }, width: 35, height: 300, hor: false, barlength: 62, type: "mainver" },
		{ "hp": { "x": 0, "y": 0 }, "dren": { "x": 0, "y": 119 }, "pray": { "x": 0, "y": 238 }, "sum": { "x": 0, "y": 357 }, width: 20, height: 550, hor: false, barlength: 80, type: "maintower" }
	];

	find(img:ImgRef) {
		if (!img) { img = a1lib.captureHoldFullRs(); }
		if (!img) { return false; }
		var sumpos = img.findSubimage(imgs.sumpoints);
		if (sumpos.length == 0) { return false; }
		var hppos = img.findSubimage(imgs.lifepoints);
		if (hppos.length == 0) { hppos = img.findSubimage(imgs.lifepointspoison); }
		if (hppos.length == 0) { return false; }

		var layout = null;
		for (var a = 0; a < ActionbarReader.layouts.length; a++) {
			var l = ActionbarReader.layouts[a];
			if (sumpos[0].x - hppos[0].x == l.sum.x - l.hp.x && sumpos[0].y - hppos[0].y == l.sum.y - l.hp.y) {
				layout = l;
				break;
			}
		}
		if (!layout) { return false; }
		this.pos = {
			x: hppos[0].x - layout.hp.x,
			y: hppos[0].y - layout.hp.y,
			layout: layout
		};

		return true;
	}

	read() {
		var buffer = a1lib.capture(this.pos.x, this.pos.y, this.pos.layout.width, this.pos.layout.height);
		if (!buffer) {
			return null;
		}
		var r = {
			hp: this.readBar(buffer, this.pos.layout.hp.x, this.pos.layout.hp.y, this.pos.layout.hor),
			dren: this.readBar(buffer, this.pos.layout.dren.x, this.pos.layout.dren.y, this.pos.layout.hor),
			pray: this.readBar(buffer, this.pos.layout.pray.x, this.pos.layout.pray.y, this.pos.layout.hor),
			sum: this.readBar(buffer, this.pos.layout.sum.x, this.pos.layout.sum.y, this.pos.layout.hor)
		};
		return r;
	}

	readBar(buffer, x, y, hor) {
		if (hor) { x += 25; y += 11; }
		else { x += 7; y += 26; }
		var width = this.pos.layout.barlength;
		for (var b = 0; b < width; b++) {
			var i = buffer.pixelOffset(x + (hor ? b : 0), y + (hor ? 0 : b));
			if (a1lib.ImageDetect.coldif(buffer.data[i], buffer.data[i + 1], buffer.data[i + 2], buffer.data[i + 3], 35, 41, 44, 255) < 20) {
				break;
			}
		}
		return b/width;
	}
}
