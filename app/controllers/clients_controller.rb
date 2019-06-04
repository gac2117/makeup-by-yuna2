class ClientsController < ApplicationController
  def index
  end

  def show
    @client = Client.find_by(id: params[:id])
    @user = User.find_by(id: current_user)
    @apps = @client.appointments.by_date
  end

  def new
    if logged_in?
      flash[:error] = "You are already signed in."
      if Client.find_by(id: current_user)
        redirect_to client_path(current_user)
      else
        redirect_to artist_path(current_user)
      end
    else
      @client = Client.new
    end
  end

  def create
    @client = Client.new(client_params)
    if @client.save
      session[:user_id] = @client.id
      redirect_to client_path(@client)
    else
      render :new
    end
  end

  def edit
    @client = User.find_by(id: current_user)
  end

  def update
    @client = User.find_by(id: current_user)
    if @client.update(client_params)
      redirect_to client_path(@client)
    else
      render :edit
    end
  end

    def popular
      hash = Client.app_count
      popular_id = User.popular(hash)
      @client = Client.find_by(id: popular_id)
    end

  private
  def client_params
    params.require(:client).permit(:name, :email, :extra, :password)
  end
end
