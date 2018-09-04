
toggleAuth = (id) => {

    let hide  = 'none';
    let show = 'block';
    let toggle = [hide, show];

    let withoutId  = '';
    let withId = 'active';
    let idToggle = [withoutId, withId];

    if(id === 'register') {
        toggle.reverse();
        idToggle.reverse()
    }

    document.querySelector('.register-body').style.display = toggle[0];
    document.querySelector('.login-body').style.display = toggle[1];

    document.querySelector('.register').id = idToggle[0];
    document.querySelector('.login').id = idToggle[1];

};

toJSONString = ( form ) => {
    var obj = {};
    var elements = form.querySelectorAll( 'input, select, textarea' );
    for( var i = 0; i < elements.length; ++i ) {
        var element = elements[i];
        var name = element.name;
        var value = element.value;

        if( name ) {
            obj[ name ] = value;
        }
    }

    return obj;
};

submitFormData = (event) => {
    event.preventDefault();
    let formObject = document.forms[`${event.target.dataset.target}-form`];
    let formData = toJSONString(formObject);
    val = formObject;
    console.log(formObject);
    if (formData.password !== formData.password_confirm){
        console.log('Enter the same password;');
        return;
    }
    delete formData['password_confirm'];
    postData(`${url}/auth/${event.target.dataset.target}`, formData, 'POST')
        .then(resp => resp.json())
        .then((resp) => {
        localStorage.setItem('token', resp.token);
        localStorage.setItem('username', resp.user.username);
        localStorage.setItem('username', resp.user.name);
        localStorage.setItem('id', resp.user.id);
        loadDashboard()
    });
};





