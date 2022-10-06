import { showAlert } from '/js/alerts.js';
const stripe = Stripe(
  'pk_test_51Lk6LjGlbtUqLEqUH7IsPjf58k0mdiW2LinrrbZZsOyJ6IlFVjoy7p5lXSr4LaOFuRpMBgEC9uMQ8pq3osWfmE4o00Y40zxtsn'
);

const bookTour = async (tourID) => {
  try {
    axios.defaults.headers.common['Authorization'] = `Bearer ${
      document.cookie.match(new RegExp('(^| )' + 'jwt' + '=([^;]+)'))[2]
    }`;
    // 1) Get checkout session from API
    const session = await axios.get(
      `/api/v1/bookings/checkout-session/${tourID}`
    );

    // 2) Create checkout form + chanre credit card
    await stripe.redirectToCheckout({
      // In card information you have to write 4242 4242 4242 4242 for test
      sessionId: session.data.session.id,
    });
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const bookBtn = document.querySelector('#book-tour');

if (bookBtn) {
  bookBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    e.target.textContent = 'Processing...';
    const tourID = e.target.dataset.tourId;
    await bookTour(tourID);
  });
}
