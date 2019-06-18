$(() => {
	bindClickHandlers()
})

const bindClickHandlers = () => {
	$('#app-link').on('click', (e) => {
		e.preventDefault();
		history.pushState(null, null, "appointments")
		fetch(`/appointments.json`)
			.then(res => res.json())
			.then(data => {
				$('.app-container').html('')
				let indexPage = `
					<h1>List of all appointments</h1>
					<table class="apps-table">
					  <thead>
					    <tr>
					      <th>Artist Name</th>
					      <th>Client Name</th>
					      <th>Appointment Date</th>
					      <th>Type of Service</th>
					    </tr>
					  </thead>
					  <tbody id="app-table">
					  </tbody>
				  </table>
				`
				$('.app-container').append(indexPage);
				data.forEach(app => {
					let newApp = new Appointment(app);
					let tableHtml = newApp.formatTable();
					$('#app-table').append(tableHtml);
				})
			
			})
			
	})

	$(document).on('click', '#app-details', function(e) {
		e.preventDefault();
		let id = $(this).attr('data-id');
		let clientId = $(this).attr('client-id');
		fetch(`/clients/${clientId}/appointments/${id}.json`)
			.then(res => res.json())
			.then(data => {
				$('.client-app-table').html('')
				let newApp = new Appointment(data);
				console.log(newApp)
				let details = newApp.formatDetails();
				$('.client-app-table').append(details)
			})
	})
	
}

class Appointment {
	constructor(id, date_time, service, comments, artist_id, client_id) {
		this.id = id;
		this.date_time = date_time;
		this.service = service;
		this.comments = comments;
		this.artist_id = artist_id;
		this.client_id = client_id;
	}

	formatTable() {
		let tableHtml = `
			<tr>
		        <td>${this.id["artist"]["name"]}</td>
		        <td>${this.id["client"]["name"]}</td>
		        <td>${this.id["date_time"]}</td>
		        <td>${this.id["service"]}</td>
		     </tr>
		`
		return tableHtml;
	}

	formatDetails() {
		let tableHtml = `
			<h3>Appointment Details</h3>
			<h4><em>Appointment Date:<em>${this.id["date_time"]}</h4>
			<h4><em>Artist Name:<em> ${this.id["artist"]["name"]}</h4>
			<h4><em>Type of Service:<em> ${this.id["service"]}</h4>
			<h4><em>Requests or Comments:<em> ${this.id["comments"]}</h4>
		`
		return tableHtml;
	}

	appInfo() {
		return `You have booked a(n) ${this.service} appointment for ${this.date_time}.`
	}
}

