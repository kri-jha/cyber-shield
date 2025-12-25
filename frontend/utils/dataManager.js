// utils/dataManager.js - Connected to Real Backend via api.js

class DataManager {
    constructor() {
        // No local cache needed if we rely on server for source of truth, 
        // or we can implement simple caching here.
    }

    // ==================== TICKET FUNCTIONS ====================

    // Create new ticket
    async createTicket(ticketData) {
        try {
            console.log('Creating ticket via API...', ticketData);
            const result = await window.api.post('/tickets', ticketData);

            if (result.success) {
                // Emit event for real-time updates (optional, or rely on polling/socket)
                this.emitTicketUpdate([result.ticket]); // Simple emit
                return {
                    success: true,
                    message: 'Ticket created successfully!',
                    ticket: result.ticket
                };
            } else {
                return { success: false, message: result.message || 'Failed to create ticket' };
            }
        } catch (error) {
            console.error('Error creating ticket:', error);
            return { success: false, message: 'Network error or server unreachable' };
        }
    }

    // Get all tickets for current user
    async getAllTickets() {
        try {
            const result = await window.api.get('/tickets');
            if (result.success) {
                return {
                    success: true,
                    tickets: result.tickets,
                    stats: this.calculateStats(result.tickets)
                };
            }
            return { success: false, tickets: [] };
        } catch (error) {
            console.error('Error fetching tickets:', error);
            return { success: false, tickets: [], message: 'Failed to load tickets' };
        }
    }

    // Get ticket by ID
    async getTicketById(ticketId) {
        try {
            // If we don't have a specific endpoint for single ticket, we can filter client side or add one.
            // For now, let's just fetch all and filter.
            const result = await this.getAllTickets();
            const ticket = result.tickets.find(t => t.id === ticketId);
            if (ticket) return { success: true, ticket };
            return { success: false, message: 'Ticket not found' };
        } catch (error) {
            return { success: false, message: 'Error loading ticket' };
        }
    }

    // Helper calculate stats locally for now
    calculateStats(tickets) {
        return {
            totalTickets: tickets.length,
            openTickets: tickets.filter(t => t.status === 'open').length,
            resolvedTickets: tickets.filter(t => t.status === 'resolved').length
        };
    }

    // Emit ticket update event (compatibility with old code)
    emitTicketUpdate(tickets) {
        try {
            const event = new CustomEvent('ticketsUpdated', {
                detail: { tickets, timestamp: new Date().toISOString() }
            });
            window.dispatchEvent(event);
        } catch (error) { console.error(error); }
    }

    onTicketsUpdate(callback) {
        window.addEventListener('ticketsUpdated', (event) => {
            if (callback) callback(event.detail);
        });
    }

    // ==================== FEED FUNCTIONS ====================
    async getFeedPosts() {
        try {
            const result = await window.api.get('/feed');
            if (result.success) return result.posts;
            return [];
        } catch (error) {
            console.error('Error loading feed:', error);
            return [];
        }
    }
}

// Create global instance
window.dataManager = new DataManager();