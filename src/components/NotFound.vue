<template>
	<div class="homeBackground">
		<div
			class="ui card"
			style="
				position: fixed;
				top: 50%;
				left: 50%;
				transform: translate(-51%, -50%);
			"
		>
			<div class="image">
				<img src="../assets/oex-vcc-logo.png" alt="" />
			</div>
			<div class="content">
				<div class="ui error message centered">
					<div class="header">How did you get here?!</div>
					<p>This page doesn't exist ¯\_(ツ)_/¯</p>
				</div>
				<div style="text-align: center">
					<router-link to="/main" tag="button" class="ui red button"
						>Go back</router-link
					>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				login: "",
				password: "",
				loginIsValid: true,
				passIsValid: true,
				isLoading: false,
				error: null,
				goToReset: false,
			};
		},
		computed: {
			errorText() {
				if (this.error) {
					return "Spróbuj ponownie!";
				} else {
					return "Zaloguj się";
				}
			},
			displayError() {
				return this.error;
			},
			displayLoading() {
				return this.isLoading;
			},
		},

	};
</script>

<style scoped>
</style>