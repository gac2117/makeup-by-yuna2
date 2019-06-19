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
					console.log(newApp)
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
				let details = newApp.formatDetails();
				$('#client-app-table').append(details)
			})
	})
	
}

class Appointment {
	constructor(app) {
		this.id = app["id"];
		this.date_time = app["date_time"];
		this.service = app["service"];
		this.comments = app["comments"];
		this.artist_name = app["artist"]["name"];
		this.client_name = app["client"]["name"];
	}

	formatTable() {
		let tableHtml = `
			<tr>
		        <td>${this.artist_name}</td>
		        <td>${this.client_name}</td>
		        <td>${this.date_time}</td>
		        <td>${this.service}</td>
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
					<p class="list-group-item-text">${this.date_time}</p>
				</li>
				<li class="list-group-item">
					<h5 class="list-group-item-heading">Type of Service:</h5>
					<p class="list-group-item-text">${this.service}</p>
				</li>
				<li class="list-group-item">
					<h5 class="list-group-item-heading">Makeup Artist Name:</h5>
					<p class="list-group-item-text">${this.artist_name}</p>
				</li>
				<li class="list-group-item">
					<h5 class="list-group-item-heading">Comments or Requests:</h5>
					<p class="list-group-item-text">${this.comments}</p>
				</li>
			</ul>
		`
		return tableHtml;
	}
}

