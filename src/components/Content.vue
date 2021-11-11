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
				class="three wide center aligned column"
				style="
					background: whitesmoke;
					border-right: 1px solid grey;
					height: 100%;
					display: flex;
					justify-content: center;
					margin-left: 12px;
				"
			>
				<div v-if="savingData">
					<div class="ui huge active double green text loader">
						Saving data...
					</div>
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
							<strong>Person who read the script:</strong>
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
						<!-- <my-counter
							v-if="showCounter"
							@updateTime="updateTime"
							@blockSaveButton="blockSaveButton"
						></my-counter> -->
					</div>
					<div style="display:flex; justify-content: center">
						<div class="ui form" v-if="!showConvoId">
							<div class="field">
								<label>Conversation ID <strong style="color:red">(MANDATORY!!!)</strong></label>
								<input v-model="conversationId" type="text" />
							</div>
						</div>
            <div v-else style="word-wrap: break-word; text-align:center; width: 50%">
              <div><strong>Conversation ID:</strong></div>
              <div >{{ showScriptData.conversationId}}</div>
            </div>
					</div>
					<div>
						<div class="ui form">
							<div class="field">
								<label>Notes:</label>
								<textarea
									rows="15"
									style="width: 100%; border: 1px solid grey"
									v-model="notes"
									v-if="!showNotes"
								></textarea>
								<div v-else>{{ showScriptData.notes }}</div>
							</div>
						</div>
					</div>
					<button v-if="showStatus.bool" class="ui button green disabled">
						Script finished!
					</button>
					<button v-else class="ui button red" :class="{loading: checkIdLoading}" @click="checkConvo">
						CLICK AFTER FINISHING THE SCRIPT
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
	import config from "../config";

	const { DateTime } = require("luxon");

	// import Counter from "./Counter.vue";
	import ScenarioDisplay from "./ScenarioDisplay.vue";
	export default {
		components: {
			ScenarioDisplay,
			// myCounter: Counter,
			// Selector,
		},
		props: ["scriptData", "savingData", "isLoading"],
		data() {
			return {
        checkIdLoading: false,
        conversationId: "",
				notes: "",
				notesFromServer: "",
				isFinished: "",
				finishTime: "",
				startTime: "",
				stopTime: "",
				duration: "",
				showCounter: false,
			};
		},
		computed: {
      showConvoId() {
        if (this.scriptData.conversationId) {
          return true
        } else {
          return false
        }
      },
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
					return true;
				} else {
					return false;
				}
			},
			showSpeaker() {
				if (this.scriptData.userName) {
					return { bool: true, value: this.scriptData.userName };
				} else {
					return { bool: false };
				}
			},
			// setDateTime() {
			// 	const dt = DateTime.now();
			// 	let date = dt.toFormat("yyyy-MM-dd").toString();
			// 	let time = dt.toFormat("T").toString();
			// 	return {
			// 		date,
			// 		time,
			// 	};
			// },
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
			// blockSaveButton(val) {
			// 	this.saveButtonBlocked = val;
			// },
			// updateTime(val) {
			// 	this.startTime = val.start;
			// 	this.stopTime = val.stop;
			// 	this.duration = val.duration;
			// },
      async checkConvo() {
        this.checkIdLoading = true;
        const res = axios
					.get(`${config.apiBaseUrl}/scripts/conversationid`, {
						headers: {
							Authorization: this.scriptData.token,
						},
						params: {
              conversation_id: this.conversationId
						},
					})
					.catch((error) => {
						console.log(error.response.data);
						console.log(error.response.data.message);
					});
          const response = (await res).data;
          console.log(response)
          let checkId = Object.keys(response).length
        if (checkId !== 0) {
          this.checkIdLoading = false;
          alert('The conversation ID you provided is already in the database assigned to a different record. Please make sure that you copied a correct, unique conversation ID from Conpeek.');
          
        } else {
          this.saveData();
        }
        this.conversationId = '';
        
      },
			async saveData() {
        if (this.conversationId == "" || this.conversationId.length != 36) {
          alert('The conversation ID is missing or is incorrect. Please copy the correct conversation ID from Conpeek and paste it in the required field.')
          this.checkIdLoading = false;
        } else {
        const dt = DateTime.now();
        let date = dt.toFormat("yyyy-MM-dd").toString();
        let time = dt.toFormat("T").toString();
				await axios
					.get(`${config.apiBaseUrl}/scripts/update`, {
						headers: {
							Authorization: this.scriptData.token,
						},
						params: {
							script_id: this.showScriptData.id,
							script_notes: this.notes =="" ? "No notes provided":this.notes,
							script_finished: 1,
							finish_date: date,
							// start_time: this.startTime,
							finish_time: time,
							// duration: this.duration,
							user_name: this.combinedName,
							user_id: this.showScriptData.userId,
              conversation_id: this.conversationId
						},
					})
					.catch((error) => {
						console.log(error.response.data);
						console.log(error.response.data.message);
					});

				this.$emit("reloadData", {
					id: this.showScriptData.id,
					name: this.showScriptData.name,
					bool: false,
				});
				this.notes = "";
        this.conversationId = "";
        this.checkIdLoading = false;
        }
			},
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