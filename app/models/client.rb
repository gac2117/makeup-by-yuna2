class Client < User
  has_many :appointments
  has_many :artists, through: :appointments 

  
  	scope :app_count, -> { joins(:appointments).group('client_id').count }

	def self.find_or_create_by_omniauth(auth)
	  	self.where(email: auth['info']['email']).first_or_create do |u|
	  		u.name = auth['info']['name']
		    u.extra = auth['info']['image']
		    u.password = SecureRandom.hex
	    end
	end

	def send_password_reset
	  generate_token(:password_reset_token)
	  self.password_reset_sent_at = Time.zone.now
	  save!
	  UserMailer.forgot_password(self).deliver
	  # This sends an e-mail with a link for the user to reset the password
	end
	
	# This generates a random password reset token for the user
	def generate_token(column)
	  begin
	    self[column] = SecureRandom.urlsafe_base64
	  end while User.exists?(column => self[column])
	end
end
