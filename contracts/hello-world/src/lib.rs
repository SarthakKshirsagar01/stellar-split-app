#![no_std]

#[cfg(test)]
extern crate std;

use soroban_sdk::{
    contract, contractimpl, contracttype,
    Address, Env, Vec, Map,
};

// ─── Data Structures ─────────────────────────────────────────────

#[contracttype]
#[derive(Clone)]
pub struct Bill {
    pub creator: Address,
    pub total_amount: i128,
    pub per_share: i128,
    pub participants: Vec<Address>,
    pub paid: Map<Address, bool>,
    pub released: bool,
}

#[contracttype]
pub enum DataKey {
    Bill(u64),
    BillCount,
}

// ─── Contract ────────────────────────────────────────────────────

#[contract]
pub struct SplitBillContract;

#[contractimpl]
impl SplitBillContract {

    // Create a new bill
    pub fn create_bill(
        env: Env,
        creator: Address,
        total_amount: i128,
        participants: Vec<Address>,
    ) -> u64 {
        creator.require_auth();

        let count: u64 = env
            .storage()
            .instance()
            .get(&DataKey::BillCount)
            .unwrap_or(0);

        let num = participants.len() as i128;
        let per_share = total_amount / num;

        let mut paid_map: Map<Address, bool> = Map::new(&env);
        for p in participants.iter() {
            paid_map.set(p.clone(), false);
        }

        let bill = Bill {
            creator: creator.clone(),
            total_amount,
            per_share,
            participants: participants.clone(),
            paid: paid_map,
            released: false,
        };

        let bill_id = count + 1;
        env.storage()
            .instance()
            .set(&DataKey::Bill(bill_id), &bill);
        env.storage()
            .instance()
            .set(&DataKey::BillCount, &bill_id);

        bill_id
    }

    // Pay your share
    pub fn pay_share(env: Env, bill_id: u64, payer: Address) {
        payer.require_auth();

        let mut bill: Bill = env
            .storage()
            .instance()
            .get(&DataKey::Bill(bill_id))
            .expect("Bill not found");

        assert!(!bill.released, "Bill already released");
        assert!(
            bill.paid.get(payer.clone()).is_some(),
            "Not a participant"
        );
        assert!(
            !bill.paid.get(payer.clone()).unwrap(),
            "Already paid"
        );

        bill.paid.set(payer.clone(), true);
        env.storage()
            .instance()
            .set(&DataKey::Bill(bill_id), &bill);
    }

    // Check if all paid and release
    pub fn release_funds(env: Env, bill_id: u64) -> bool {
        let mut bill: Bill = env
            .storage()
            .instance()
            .get(&DataKey::Bill(bill_id))
            .expect("Bill not found");

        assert!(!bill.released, "Already released");

        let all_paid = bill
            .participants
            .iter()
            .all(|p| bill.paid.get(p.clone()).unwrap_or(false));

        if all_paid {
            bill.released = true;
            env.storage()
                .instance()
                .set(&DataKey::Bill(bill_id), &bill);
            return true;
        }

        false
    }

    // Get bill status
    pub fn get_bill(env: Env, bill_id: u64) -> Bill {
        env.storage()
            .instance()
            .get(&DataKey::Bill(bill_id))
            .expect("Bill not found")
    }

    // Check if a specific person paid
    pub fn has_paid(env: Env, bill_id: u64, participant: Address) -> bool {
        let bill: Bill = env
            .storage()
            .instance()
            .get(&DataKey::Bill(bill_id))
            .expect("Bill not found");

        bill.paid.get(participant).unwrap_or(false)
    }
}

// ─── Tests ───────────────────────────────────────────────────────

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{
        testutils::Address as _,
        Address, Env, Vec,
    };

    #[test]
    fn test_create_bill() {
        let env = Env::default();
        env.mock_all_auths();
        let contract_id = env.register_contract(None, SplitBillContract);
        let client = SplitBillContractClient::new(&env, &contract_id);
        let creator = Address::generate(&env);
        let p1 = Address::generate(&env);
        let p2 = Address::generate(&env);
        let mut participants = Vec::new(&env);
        participants.push_back(p1.clone());
        participants.push_back(p2.clone());
        let bill_id = client.create_bill(&creator, &1000, &participants);
        assert_eq!(bill_id, 1);
        let bill = client.get_bill(&bill_id);
        assert_eq!(bill.total_amount, 1000);
        assert_eq!(bill.per_share, 500);
        assert_eq!(bill.released, false);
    }

    #[test]
    fn test_pay_share() {
        let env = Env::default();
        env.mock_all_auths();
        let contract_id = env.register_contract(None, SplitBillContract);
        let client = SplitBillContractClient::new(&env, &contract_id);
        let creator = Address::generate(&env);
        let p1 = Address::generate(&env);
        let p2 = Address::generate(&env);
        let mut participants = Vec::new(&env);
        participants.push_back(p1.clone());
        participants.push_back(p2.clone());
        let bill_id = client.create_bill(&creator, &1000, &participants);
        assert_eq!(client.has_paid(&bill_id, &p1), false);
        client.pay_share(&bill_id, &p1);
        assert_eq!(client.has_paid(&bill_id, &p1), true);
        assert_eq!(client.has_paid(&bill_id, &p2), false);
    }

    #[test]
    fn test_release_funds() {
        let env = Env::default();
        env.mock_all_auths();
        let contract_id = env.register_contract(None, SplitBillContract);
        let client = SplitBillContractClient::new(&env, &contract_id);
        let creator = Address::generate(&env);
        let p1 = Address::generate(&env);
        let p2 = Address::generate(&env);
        let mut participants = Vec::new(&env);
        participants.push_back(p1.clone());
        participants.push_back(p2.clone());
        let bill_id = client.create_bill(&creator, &1000, &participants);
        let released_early = client.release_funds(&bill_id);
        assert_eq!(released_early, false);
        client.pay_share(&bill_id, &p1);
        client.pay_share(&bill_id, &p2);
        let released = client.release_funds(&bill_id);
        assert_eq!(released, true);
    }

    #[test]
    #[should_panic(expected = "Already paid")]
    fn test_cannot_pay_twice() {
        let env = Env::default();
        env.mock_all_auths();
        let contract_id = env.register_contract(None, SplitBillContract);
        let client = SplitBillContractClient::new(&env, &contract_id);
        let creator = Address::generate(&env);
        let p1 = Address::generate(&env);
        let mut participants = Vec::new(&env);
        participants.push_back(p1.clone());
        let bill_id = client.create_bill(&creator, &500, &participants);
        client.pay_share(&bill_id, &p1);
        client.pay_share(&bill_id, &p1);
    }
}