<template>
	<div class="ui center aligned middle aligned error message">
		<div class="header">You have been logged out!</div>

			<p>It seems that you have logged in somewhere else.</p>
			<p>Please click the button below to log in again.</p>

		<button style="margin: 5px;" class="ui button red" @click="reloadPage">Log in again</button>
	</div>
</template>

<script>
	export default {
		methods: {
			reloadPage() {
				window.location.reload();
			},
		},
	};
</script>

<style>
</style>