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
					<table class="table">
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
				$('#client-app-table').html('')
				let newApp = new Appointment(data);
				console.log(newApp)
				let details = newApp.formatDetails();
				$('#client-app-table').append(details)
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
			<ul class="list-group">
				<li class="list-group-item">
					<h5 class="list-group-item-heading">Date and Time:</h5> 
					<p class="list-group-item-text">${this.id["date_time"]}</p>
				</li>
				<li class="list-group-item">
					<h5 class="list-group-item-heading">Type of Service:</h5>
					<p class="list-group-item-text">${this.id["service"]}</p>
				</li>
				<li class="list-group-item">
					<h5 class="list-group-item-heading">Makeup Artist Name:</h5>
					<p class="list-group-item-text">${this.id["artist"]["name"]}</p>
				</li>
				<li class="list-group-item">
					<h5 class="list-group-item-heading">Comments or Requests:</h5>
					<p class="list-group-item-text">${this.id["comments"]}</p>
				</li>
			</ul>
		`
		return tableHtml;
	}
}

