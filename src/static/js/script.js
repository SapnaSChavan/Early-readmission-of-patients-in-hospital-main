// static/js/script.js

document.getElementById('prediction-form').addEventListener('submit', function(e) {
    e.preventDefault();  // Prevent the default form submission

    // Collect form data
    const Patient_Id = document.getElementById('Patient_Id').value;

    const Patient_Age = parseInt(document.getElementById('Patient_Age').value);
    const change = document.getElementById('change').value;
    const payer_code_group = document.getElementById('payer_code_group').value;
    const race = document.getElementById('race').value;
    const diag_3_cat = document.getElementById('diag_3_cat').value;


    const time_in_hospital = parseInt(document.getElementById('time_in_hospital').value);
    const num_lab_procedures = parseFloat(document.getElementById('num_lab_procedures').value);
    const num_procedures = parseInt(document.getElementById('num_procedures').value);
    const num_medications = parseFloat(document.getElementById('num_medications').value);
    const number_emergency = parseInt(document.getElementById('number_emergency').value);
    const number_diagnoses = parseInt(document.getElementById('number_diagnoses').value);
    const number_outpatient_treated = parseFloat(document.getElementById('number_outpatient_treated').value);
    const number_inpatient_treated = parseFloat(document.getElementById('number_inpatient_treated').value);
    const A1Cresult = document.getElementById('A1Cresult').value;
    const insulin = parseInt(document.getElementById('insulin').value);
    const metformin = parseInt(document.getElementById('metformin').value);

    const diabetesMed = document.getElementById('diabetesMed').value;
    const admission_type_desc = document.getElementById('admission_type_desc').value;
    const discharge_category = document.getElementById('discharge_category').value;
    const admission_category = document.getElementById('admission_category').value;

    // Input Validation
    let errors = [];

    if (isNaN(time_in_hospital) || time_in_hospital < 0) {
        errors.push("Time in Hospital must be a non-negative integer.");
    }

    if (isNaN(num_lab_procedures) || num_lab_procedures < 0) {
        errors.push("Number of Lab Procedures must be a non-negative number.");
    }

    if (isNaN(num_procedures) || num_procedures < 0) {
        errors.push("Number of Procedures must be a non-negative integer.");
    }

    if (isNaN(num_medications) || num_medications < 0) {
        errors.push("Number of Medications must be a non-negative number.");
    }

    if (isNaN(number_emergency) || number_emergency < 0) {
        errors.push("Number of Emergency Visits must be a non-negative integer.");
    }

    if (isNaN(number_diagnoses) || number_diagnoses < 0) {
        errors.push("Number of Diagnoses must be a non-negative integer.");
    }

    if (isNaN(number_outpatient_treated) || number_outpatient_treated < 0) {
        errors.push("Number of Outpatient Treated must be a non-negative number.");
    }

    if (isNaN(number_inpatient_treated) || number_inpatient_treated < 0) {
        errors.push("Number of Inpatient Treated must be a non-negative number.");
    }

    if (A1Cresult === "") {
        errors.push("A1C Result is required.");
    }

    if (isNaN(insulin)) {
        errors.push("Insulin must not be empty.");
    }

    if (diabetesMed === "") {
        errors.push("DiabetesMed is required.");
    }

    if (admission_type_desc === "") {
        errors.push("Admission Type Description is required.");
    }

    if (discharge_category === "") {
        errors.push("Discharge Category is required.");
    }

    if (admission_category === "") {
        errors.push("Admission Category is required.");
    }

    // Display errors if any
    if (errors.length > 0) {
        document.getElementById('result').innerHTML = `<span style="color: red;">${errors.join('<br>')}</span>`;
        return;
    }

    // Create a data object to send to the backend
    const data = {
        'Patient_Id':Patient_Id,
        'Patient_Age':Patient_Age,
        'change' : change,
        'payer_code_group':payer_code_group,
        'race':race,
        'diag_3_cat':diag_3_cat,
        'time_in_hospital': time_in_hospital,
        'num_lab_procedures': num_lab_procedures,
        'num_procedures': num_procedures,
        'num_medications': num_medications,
        'number_emergency': number_emergency,
        'number_diagnoses': number_diagnoses,
        'number_outpatient_treated': number_outpatient_treated,
        'number_inpatient_treated': number_inpatient_treated,
        'A1Cresult': A1Cresult,
        'insulin': insulin,
        'metformin':metformin,
        'diabetesMed': diabetesMed,
        'admission_type_desc': admission_type_desc,
        'discharge_category': discharge_category,
        'admission_category': admission_category
    };

    // Make a POST request to the backend
    fetch('/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if(result.error){
            document.getElementById('result').innerHTML = `<span style="color: red;">Error: ${result.error}</span>`;
        } else {
            const prediction = result.prediction === 1 ? "Readmitted within 30 days" : "Not Readmitted within 30 days";
            const probability = (result.probability * 100).toFixed(2);
            var status = "";
            if(probability < 42.00) {
                status="Low";
            } else if(probability < 55.00) {
                status = "Medium";
            } else {
                status = "High";
            }    
            // Get the result element
            const resultDiv = document.getElementById('result');
    
            // Set the message
            resultDiv.innerHTML = `
                <p><strong>${status} chance that the patient will be readmitted to the hospital.</strong></p>
                <p></p>

                <p><strong>Probability: ${probability}%</strong></p>
            `;
    
            // Conditional background colors based on the probability
            if(probability < 42) {
                resultDiv.style.backgroundColor = 'lightgreen';  // Green for low probability
            } else if(probability < 55) {
                resultDiv.style.backgroundColor = 'khaki';  // Warning color for moderate probability
            } else {
                resultDiv.style.backgroundColor = 'lightcoral';  // Alert color for high probability
            }
    
            // Optional: Style the result text box to make it look nicer
            resultDiv.style.padding = '15px';
            resultDiv.style.borderRadius = '8px';  // Rounded corners
            resultDiv.style.marginTop = '10px';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('result').innerHTML = `<span style="color: red;">An error occurred while processing your request.</span>`;
    });
    
});
