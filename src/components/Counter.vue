<template>
	<div class="ui grid">
		<div class="ui row">
			<div class="ui center aligned column">
				<button class="ui green button" :class="{disabled: counter.started}" @click="timeCounter">{{buttonText}}</button>
				<button
					class="ui red button"
					:class="{ disabled: !counter.started }"
					@click="stopCounter"
				>
					Stop
				</button>
				<div v-if="counter.stopped">Total duration: <b>{{ scriptDuration.minutes }}:{{ scriptDuration.seconds }}</b></div>
				<div v-if="counter.started">
					Duration: <b>{{ showTime.minutes }}</b> minutes,
					<b>{{ showTime.seconds }}</b> seconds
				</div>
			</div>
		</div>
		<div class="ui row"></div>
	</div>
</template>

<script>
	const { DateTime } = require("luxon");
	export default {
		data() {
			return {
        readingFinished: false,
				timeStart: "",
				timeStop: "",
				timeDisplay: "",
				timeDifference: {
					minutes: 0,
					seconds: 0,
				},
				counter: {
					started: false,
					stopped: false,
				},
				// timeHandler: {
				// 	minutes: 0,
				// 	seconds: 0,
				// },
				interval: "",
				scriptDuration: {
					seconds: 0,
					minutes: 0,
				},
			};
		},
		methods: {
			timeCounter() {
				this.counter.started = true;
        this.counter.stopped = false;
				this.timeStart = DateTime.now();
				this.interval = setInterval(this.startCounter, 1000);
			},
			startCounter() {
				let timeNow = DateTime.now();
				let duration = timeNow.diff(this.timeStart, ["minutes", "seconds"]);
				this.timeDifference.minutes = duration.values.minutes;
				this.timeDifference.seconds = Math.round(duration.values.seconds);
        this.$emit('blockSaveButton', true)
			},
			stopCounter() {
				// let timeStart = this.timeStart;
        
        this.readingFinished = true;
        this.counter.started = false;
        this.counter.stopped = true;
				this.timeStop = DateTime.now().toFormat("T");
				// console.log(timeStart);
				// this.timeDisplay = `Start time: ${timeStart}, End time: ${timeStop}`;
				// let duration = timeStop.diff(timeStart, ["minutes", "seconds"]);
				// this.timeDifference.minutes = duration.values.minutes;
				// this.timeDifference.seconds = Math.round(duration.values.seconds);

				clearInterval(this.interval);
				console.log(this.timeDifference.seconds.toString().length);

				// if (this.timeDifference.minutes.toString().length < 2) {
				// 	this.timeHandler.minutes = `0${this.timeDifference.minutes}`;
				// } else {
				// 	this.timeHandler.minutes = `${this.timeDifference.minutes}`;
				// }
				// if (this.timeDifference.seconds.toString().length < 2) {
				// 	this.timeHandler.seconds = `0${this.timeDifference.minutes}`;
				// } else {
				// 	this.timeHandler.seconds = `${this.timeDifference.minutes}`;
				// }

				if (this.timeDifference.minutes.toString().length < 2) {
					this.scriptDuration.minutes = `0${this.timeDifference.minutes}`;
				} else {
					this.scriptDuration.minutes = `${this.timeDifference.minutes}`;
				}

				if (this.timeDifference.seconds.toString().length < 2) {
					this.scriptDuration.seconds = `0${this.timeDifference.seconds}`;
				} else {
					this.scriptDuration.seconds = `${this.timeDifference.seconds}`;
				}

				this.$emit("updateTime", {
					start: this.timeStart.toFormat("T"),
					stop: this.timeStop,
					duration: `${this.scriptDuration.minutes}:${this.scriptDuration.seconds}`,
				});
        this.$emit('blockSaveButton', false)
				// this.scriptDuration = `${this.timeDifference.minutes}:${this.timeDifference.seconds}`
				this.timeDifference.minutes = 0;
				this.timeDifference.seconds = 0;
				this.timeStart = DateTime.now();
			},
		},
		computed: {
			showTime() {
				return this.timeDifference;
			},
      buttonText() {
        return this.timeStop != "" ? "Read again" : "Start timer"
      }
		},
	};
</script>

<style>
</style>