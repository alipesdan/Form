export const formatters = {
    ssn: (val) => {
        if (val) {
            var x = val.replace(/\D/g, '').match(/(\d{0,3})(\d{0,2})(\d{0,4})/);
            val = !x[2] ? x[1] :  x[1] + '-' + x[2] + (x[3] ? '-' + x[3] : '');
            return val;
        }
    },
    zip: (val) => {
        if (val) {
            return val.replace(/\D/g, '').substring(0, 5);
        }
    },
    routing_number: (val) => {
        if (val) {
            return val.replace(/\D/g, '').substring(0, 9);
        }
    },
    bank_account: (val) => {
        if (val) {
            return val.replace(/\D/g, '').substring(0, 13);
        }
    },
    tel: (val) => {
        if (val) {
            var x = val.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
            val = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
            return val;
        }
    }
};

export default formatters;