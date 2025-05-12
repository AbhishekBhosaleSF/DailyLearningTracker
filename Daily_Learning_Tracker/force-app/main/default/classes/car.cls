public class car {
	public string model = 'Mustang'; 
	private string engineType ='v6';
	protected string brand ='ford';
	
    private void engineStart(){
		system.debug('Engine start :'+engineType);
	}
	
    public void showDetails(){
		system.debug('model:'+model);
		engineStart();
	}
	
}