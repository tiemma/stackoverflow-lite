
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


submitAuthFormData = (event) => {
    let formData = getFormData(event);
    let formObject = getFormObject(event);
    let target = event.target.dataset.target;
    if (formData.password !== formData.password_confirm && target === 'register'){
        formObject.querySelector(".error").innerHTML = 'Enter the same password';
        return;
    }
    delete formData['password_confirm'];
    postData(`${API_URL}/auth/${target}`, formData, 'POST')
        .then(resp => resp.json())
        .then((resp) => {
            if(resp.token) {
                localStorage.setItem('token', resp.token);
                localStorage.setItem('username', resp.user.username);
                localStorage.setItem('name', resp.user.name);
                localStorage.setItem('id', resp.user.id);
                loadDashboard()
            } else {
                formObject.querySelector(".error").innerHTML = resp.error;
            }
    });
};





