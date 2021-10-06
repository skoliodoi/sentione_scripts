<template>
	<div class="ui two column grid" style="height: 100%">
		<div v-if="isLoading" class="centered row">
			<div
				class="sixteen wide column"
				style="background: whitesmoke; border-right: 1px solid grey"
			>
				<div class="ui active massive blue elastic loader"></div>
			</div>
		</div>
		<div v-else class="centered row">
			<div
				class="three wide column"
				style="
					background: whitesmoke;
					border-right: 1px solid grey;
					height: 100%;
					display: flex;
					justify-content: center;
				"
			>
				<div v-if="savingData">
					<div class="ui huge active double green text loader">Saving data...</div>
				</div>
				<div
					v-else
					style="
						display: flex;
						flex-direction: column;
						justify-content: space-around;
						align-items: center;
						height: 100%;
					"
				>
					<div>
						<div style="text-align: center">
							<strong>Script status:</strong>
						</div>
						<div style="text-align: center">{{ showStatus.value }}</div>
					</div>
					<div v-if="showSpeaker.bool">
						<div style="text-align: center">
							<strong>Osoba przeprowadzająca rozmowę:</strong>
						</div>
						<div style="text-align: center">
							{{ showSpeaker.value }}
						</div>
					</div>
					<div v-if="showDateTime.bool">
						<div style="text-align: center">
							<strong>Date and time of finishing the script:</strong>
						</div>
						<div style="text-align: center">{{ showDateTime.value }}</div>
					</div>

					<div>
						<div class="ui form">
							<div class="field">
								<label>Notes:</label>
								<textarea
									rows="25"
									style="width: 100%; border: 1px solid grey"
									v-model="notes"
									v-if="showNotes"
								></textarea>
								<div v-else>{{ showScriptData.notes }}</div>
							</div>
						</div>
					</div>
					<button v-if="showStatus.bool" class="ui button green disabled">
						Script finished!
					</button>
					<button
						v-else
						class="ui button blue"
						@click="saveData"
					>
						Save
					</button>
				</div>
			</div>
			<div
				class="twelve wide left floated column middle"
				style="background: #aadae3"
			>
				<scenario-display
					:scriptText="showScriptData.script"
				></scenario-display>
			</div>
		</div>
	</div>
</template>

<script>
	// import moment from 'moment'
	import axios from "axios";
	const { DateTime } = require("luxon");

	import ScenarioDisplay from "./ScenarioDisplay.vue";
	export default {
		props: ["scriptData", "savingData", "isLoading"],
		data() {
			return {
				notes: "",
				notesFromServer: "",
				isFinished: "",
				finishTime: "",
			};
		},
		computed: {
			combinedName() {
				return `${this.scriptData.firstName} ${this.scriptData.lastName}`;
			},
			showSavingStatus() {
				if (this.savingData) {
					return true;
				} else {
					return false;
				}
			},
			showStatus() {
				if (this.scriptData.isFinished) {
					return {
						bool: true,
						value: "Script finished!",
					};
				} else {
					return {
						bool: false,
						value: "Script not finished yet",
					};
				}
			},
			showNotes() {
				if (this.scriptData.notes) {
					return false;
				} else {
					return true;
				}
			},
			showSpeaker() {
				if (this.scriptData.userName) {
					return { bool: true, value: this.scriptData.userName };
				} else {
					return { bool: false };
				}
				// return "Szymon";
			},
			setDateTime() {
				const dt = DateTime.now();
				let date = dt.toFormat("yyyy-MM-dd").toString();
				let time = dt.toFormat("T").toString();
				return {
					date,
					time,
				};
			},
			showDateTime() {
				if (this.scriptData.finishDate) {
					let combinedTime = `${this.scriptData.finishDate} ${this.scriptData.finishTime}`;
					return {
						bool: true,
						value: combinedTime,
					};
				} else {
					return {
						bool: false,
					};
				}
			},
			showScriptData() {
				return this.scriptData;
			},
		},
		methods: {
			async saveData() {
				await axios
					.post("http://127.0.0.1:8000/", {
						script_id: this.showScriptData.id,
						script_notes: this.notes,
						script_finished: true,
						finish_date: this.setDateTime.date,
						finish_time: this.setDateTime.time,
						user_name: this.combinedName,
						user_id: this.showScriptData.userId,
					})
					.then((response) => {
						console.log(response);
					})
					.catch((error) => {
						console.log(error.response.data);
					});
				this.$emit("reloadData", {
					id: this.showScriptData.id,
					name: this.showScriptData.name,
          bool: false
				});
				this.notes = "";
			},
		},
		components: {
			ScenarioDisplay,
			// Selector,
		},
	};
</script>

<style>
	/* .visible {
																	border: 1px solid red;
																} */

	.ui.grid > .row {
		padding-bottom: 0;
		margin-bottom: -1rem;
	}
</style>